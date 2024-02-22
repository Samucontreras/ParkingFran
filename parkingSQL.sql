CREATE DATABASE if not exists parking;

use parking;

CREATE TABLE Plazas (
    id_plaza INT PRIMARY KEY AUTO_INCREMENT,
    Disponible BOOLEAN DEFAULT TRUE,
    Matricula VARCHAR(10) UNIQUE
);

CREATE TABLE Tickets (
    id_ticket INT PRIMARY KEY AUTO_INCREMENT,
    id_plaza INT NOT NULL,
    Matricula VARCHAR(10),
    Inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Fin DATETIME,
    Importe DECIMAL(10, 2),
	CONSTRAINT FK_Transaccion_Plaza FOREIGN KEY (id_plaza) REFERENCES Plazas (id_plaza)
);

DELIMITER //
CREATE TRIGGER insertCar
BEFORE UPDATE ON Plazas
FOR EACH ROW
BEGIN
    -- Verificar si Matricula ha cambiado
    IF OLD.Matricula IS NULL AND NEW.Matricula IS NOT NULL THEN
        -- Actualizar Disponible a FALSE
        SET NEW.Disponible = FALSE;
        
        -- Insertar un nuevo registro en Tickets
        INSERT INTO Tickets (id_plaza, Matricula)
        VALUES (NEW.id_plaza, NEW.Matricula);
    END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER exitCar
BEFORE UPDATE ON Plazas
FOR EACH ROW
BEGIN
    -- Verificar si Matricula ha cambiado
    IF OLD.Matricula IS NOT NULL AND NEW.Matricula IS NULL THEN
        -- Actualizar Disponible a TRUE
        SET NEW.Disponible = TRUE;
		-- Actualizar registro en tickets
        UPDATE Tickets
        SET FIN = CURRENT_TIMESTAMP,
        Importe = TIMESTAMPDIFF(MINUTE, Inicio, CURRENT_TIMESTAMP) * 0.05
        WHERE id_plaza = OLD.id_plaza AND Importe IS NULL;
	END IF;
END;
//
DELIMITER ;

SELECT SUM(Importe) AS SumaImportes
FROM Tickets
WHERE DATE(Inicio)=CURDATE();

INSERT INTO Plazas (Disponible, Matricula)
SELECT TRUE, NULL
FROM information_schema.tables
LIMIT 5;

INSERT INTO Plazas (Disponible, Matricula)
VALUES(true, null);

DELETE FROM Plazas;

select * FROM Tickets;

UPDATE Plazas
SET Matricula = null
WHERE Matricula IS NOT NULL;

drop database parking;
