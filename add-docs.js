const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({
    tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});

const filesToProcess = [
    'src/main.ts',
    'src/app.module.ts',
    'src/database/database.module.ts',
    'src/auth/entities/user.entity.ts',
    'src/auth/auth.module.ts',
    'src/auth/auth.controller.ts',
    'src/auth/auth.service.ts',
    'src/auth/enum/role.enum.ts',
    'src/auth/enum/auth.enum.ts',
    'src/packages/entities/package.entity.ts',
    'src/packages/packages.module.ts',
    'src/packages/packages.controller.ts',
    'src/packages/packages.service.ts',
    'src/packages/enum/package.enum.ts',
    'src/packages/dto/create-package.dto.ts',
    'src/packages/dto/update-package.dto.ts',
    'src/rooms/entities/room.entity.ts',
    'src/rooms/rooms.module.ts',
    'src/rooms/rooms.controller.ts',
    'src/rooms/rooms.service.ts',
    'src/rooms/dto/create-room.dto.ts',
    'src/rooms/dto/update-room.dto.ts',
    'src/students/entities/student.entity.ts',
    'src/students/students.module.ts',
    'src/students/students.controller.ts',
    'src/students/students.service.ts',
    'src/students/dto/create-student.dto.ts',
    'src/students/dto/create-bulk-student.dto.ts',
    'src/students/dto/update-student.dto.ts',
    'src/users/users.module.ts',
    'src/users/users.controller.ts',
    'src/users/users.service.ts',
    'src/users/dto/create-user.dto.ts',
    'src/users/dto/update-user.dto.ts',
    'src/common/filter/http-exception.filter.ts',
    'src/common/interceptors/transform.interceptor.ts',
];

for (const filePath of filesToProcess) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${filePath}, does not exist`);
        continue;
    }
    const sourceFile = project.addSourceFileAtPath(fullPath);
    console.log(`Processing ${filePath}`);

    // Add docs to classes
    sourceFile.getClasses().forEach(cls => {
        if (cls.getJsDocs().length === 0) {
            const isEntity = cls.getDecorator('Entity') !== undefined;
            const isController = cls.getDecorator('Controller') !== undefined;
            const isService = cls.getDecorator('Injectable') !== undefined;
            const isModule = cls.getDecorator('Module') !== undefined;
            
            let docText = `Kelas ${cls.getName()}`;
            if (isEntity) docText += ` adalah entitas database.`;
            else if (isController) docText += ` mengelola request HTTP masuk.`;
            else if (isService) docText += ` menangani logika bisnis.`;
            else if (isModule) docText += ` adalah modul fitur.`;
            else docText += `.`;
            
            cls.addJsDoc(docText);
        }

        // Add docs to properties (Entities, DTOs)
        cls.getProperties().forEach(prop => {
            if (prop.getJsDocs().length === 0) {
                const propName = prop.getName();
                const typeStr = prop.getType().getText();
                prop.addJsDoc(`Properti ${propName} dengan tipe ${typeStr}.`);
            }
        });

        // Add docs to methods
        cls.getMethods().forEach(method => {
            if (method.getJsDocs().length === 0 && method.getName() !== 'constructor') {
                const isGet = method.getDecorator('Get') !== undefined;
                const isPost = method.getDecorator('Post') !== undefined;
                const isPatch = method.getDecorator('Patch') !== undefined;
                const isDelete = method.getDecorator('Delete') !== undefined;
                
                let action = "Mengeksekusi";
                if (isGet) action = "Mengambil data melalui";
                if (isPost) action = "Membuat data baru melalui";
                if (isPatch) action = "Memperbarui data melalui";
                if (isDelete) action = "Menghapus data melalui";

                let docText = `${action} operasi ${method.getName()}.`;
                
                const structure = {
                    description: docText,
                    tags: []
                };

                method.getParameters().forEach(param => {
                    structure.tags.push({
                        tagName: "param",
                        text: `${param.getName()} Parameter input.`
                    });
                });

                structure.tags.push({
                    tagName: "returns",
                    text: `Hasil dari operasi ${method.getName()}.`
                });

                method.addJsDoc(structure);
            }
        });
    });

    // Add docs to interfaces
    sourceFile.getInterfaces().forEach(iface => {
        if (iface.getJsDocs().length === 0) {
            iface.addJsDoc(`Antarmuka ${iface.getName()}.`);
        }
        iface.getProperties().forEach(prop => {
            if (prop.getJsDocs().length === 0) {
                prop.addJsDoc(`Properti ${prop.getName()}.`);
            }
        });
    });

    // Add docs to enums
    sourceFile.getEnums().forEach(enm => {
        if (enm.getJsDocs().length === 0) {
            enm.addJsDoc(`Enumerasi ${enm.getName()}.`);
        }
    });

    sourceFile.saveSync();
}
console.log('Selesai');
