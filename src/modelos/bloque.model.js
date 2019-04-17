var MySql = require('../datos/mysql');

class BloqueModelo {

    static async insertar(bloque) {
        let  mysql = new MySql().getInstancia();

        let posicion = bloque.posicion;

        let resInsertPos = await mysql.query(
            `INSERT INTO posiciones (latitud, longitud)
                VALUES (?, ?);`,
            [
                posicion.latitud,
                posicion.longitud
            ]
        )

        let resInsertBloque = await mysql.query(
            `INSERT INTO bloques (nombre, codigo, id_zona, id_posicion) 
                VALUES (?, ?, ?, ?);`,
            [
                bloque.nombre,
                bloque.codigo,
                bloque.idZona,
                resInsertPos.insertId
            ]
        );

        let salones = bloque.salones;

        for ( let salon of salones ) {
            let resInsertSalon = await mysql.query(
                `INSERT INTO salones (nombre, codigo, piso, id_bloque)
                    VALUES (?, ?, ?, ?);`,
                [
                    salon.nombre,
                    salon.codigo,
                    salon.piso,
                    resInsertBloque.insertId
                ]
            );

            salon.idServer = resInsertSalon.insertId;
        }

        // Retornamos el id en el cual se insertó en la base de datos para que
        // porterior mente envien las imagenes y relacionarlas con el bloque y los salones
        bloque.idServer = resInsertBloque.insertId;

        return bloque;
    }

    static async editarPosicion( posicion, idBloque ) {
        let  mysql = new MySql().getInstancia();

        let resInsertPos = await mysql.query(
            `INSERT INTO posiciones (latitud, longitud)
                VALUES (?, ?);`,
            [
                posicion.latitud,
                posicion.longitud
            ]
        );

        let resUpdateBloque = await mysql.query(
            `UPDATE bloques SET id_posicion = ? WHERE id = ?;`,
            [
                resInsertPos.insertId,
                idBloque
            ]
        );

        return resUpdateBloque;
    }

}

module.exports = BloqueModelo;