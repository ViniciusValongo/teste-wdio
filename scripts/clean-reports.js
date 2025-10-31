const fs = require('fs-extra');
const path = require('path');

const directories = [
    path.join(__dirname, '../allure-results'),
    path.join(__dirname, '../allure-report'),
    path.join(__dirname, '../screenshots')
];

console.log('Limpando relatórios antigos...\n');

directories.forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.removeSync(dir);
        console.log(`Removido: ${path.basename(dir)}`);
    } else {
        console.log(`Não encontrado: ${path.basename(dir)}`);
    }
});

// Recria diretórios vazios
directories.forEach(dir => {
    fs.ensureDirSync(dir);
    console.log(`Criado: ${path.basename(dir)}`);
});

console.log('\n Limpeza concluída com sucesso!');
