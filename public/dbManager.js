const { response } = require('express'); // Requiere el módulo 'express' para manejar las respuestas HTTP.
const db = require('./db'); // Requiere el módulo './db' para la conexión a la base de datos.
var plazas = null; // Variable global para almacenar la información de las plazas de aparcamiento.

// Función asincrónica para insertar un coche en una plaza.
const insertCar = async (ID_Plaza, matricula) => {
    try {
        console.log(ID_Plaza + ' ' + matricula); // Imprime en consola el ID de la plaza y la matrícula del coche.
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE Plazas SET Matricula = ? WHERE id_plaza = ?",
                [matricula, ID_Plaza],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            );
        });
    } catch (error) {
        console.error('Error en insertCar: ' + error.message); // Imprime en consola el error en caso de que ocurra.
        throw new Error('Error al intriducir el coche'); // Lanza un nuevo error indicando el fallo.
    }
}

// Función asincrónica para actualizar la información de las plazas de aparcamiento.
const updatePlazas = async () => {
    try {
        const respuesta = await new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM Plazas",
                [],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            )
        });
        plazas = respuesta; // Actualiza la variable global 'plazas' con la respuesta de la consulta a la base de datos.
    } catch (error) {
        console.error('Error actualizando los datos de las plazas'); // Imprime en consola el error en caso de que ocurra.
        throw new Error('Error actualizando los datos de las plazas'); // Lanza un nuevo error indicando el fallo.
    }
}

// Función para obtener las plazas de aparcamiento.
function getPlazas () {
    if (plazas)
        return plazas; // Retorna las plazas si existen.
}

// Función asincrónica para sacar un coche de una plaza.
const exitCar = async (ID_Plaza) => {
    try {
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE Plazas SET Matricula = null WHERE id_plaza = ?",
                [ID_Plaza],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            );
        });
    } catch (error) {
        console.error('ERROR EXIT CAR, ERROR CODE: ' + error.message); // Imprime en consola el error en caso de que ocurra.
    }
}

// Función asincrónica para obtener el total de dinero recaudado en el día actual.
const getMoney = async () => {
    try {
        const respuesta = await new Promise((resolve, reject) => {
            db.query(
                `SELECT SUM(Importe) AS SumaImportes
                FROM Tickets
                WHERE DATE(Inicio)=CURDATE();`,
                [],
                (err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                }
            )
        });
        return respuesta[0].SumaImportes; // Retorna la suma de importes obtenida de la consulta.
    } catch (error) {
        // Manejo de errores.
    }
}

module.exports = { getPlazas, updatePlazas, insertCar, exitCar, getMoney } // Exporta las funciones para su uso en otros archivos.
