const app = require("./src/app")
const { synchronizeDatabase } = require('./src/config/database');

const port = process.env.PORT || 3000;
synchronizeDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
})
.catch((error) =>{
    console.error('Error synchronizing database:', error);
});