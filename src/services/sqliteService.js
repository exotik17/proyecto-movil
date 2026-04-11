import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabaseSync('nombre_de>-su_base_de_datos');

// Dentro de este archivo irán las sentencias y queries sql

const init = ()=>{
    //Logica para arrancar la bd
}

const actualizarGasolina =()=>{
    const result = db.runSync(
        //CONSULTA SQL PARA UPDATE
    )

}

export default {
    init,
    actualizarGasolina
}