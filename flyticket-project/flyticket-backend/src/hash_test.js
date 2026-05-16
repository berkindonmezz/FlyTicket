const bcrypt = require('bcrypt');

const hash = bcrypt.hashSync('admin', 10);

console.log("\n--- AŞAĞIDAKİ KOMUTU KOPYALA VE MYSQL'DE ÇALIŞTIR ---");
console.log(`UPDATE admin SET password = '${hash}' WHERE username = 'admin';`);
console.log("----------------------------------------------------\n");