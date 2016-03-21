<?php
//namespace Foundationphp\Sessions;
require_once ("MysqlSessionHandler.php");
require_once ("PersistentProperties.php");

class PersistentSessionHandler extends MysqlSessionHandler
{
    //use PersistentProperties;

    /**
     * Writes the session data to the database
     *
     * @param string $session_id
     * @param string $data
     * @return bool
     */
    public function write($session_id, $data)
    {
        try {
            $sql = "INSERT INTO $this->table_sess ($this->col_sid,
            $this->col_expiry, $this->col_data)
            VALUES (:sid, :expiry, :data)
            ON DUPLICATE KEY UPDATE
            $this->col_expiry = :expiry,
            $this->col_data = :data";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':expiry', $this->expiry, \PDO::PARAM_INT);
            $stmt->bindParam(':data', $data);
            $stmt->bindParam(':sid', $session_id);
            $stmt->execute();
           // if (isset($_SESSION[$this->sess_persist]) || isset($_SESSION[$this->cookie])) {
             //   $this->storeAutologinData($data);
            //}
            //return true;
        } catch (\PDOException $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollback();
            }
            throw $e;
        }
    }

    /**
     * Copies the user's session data to the autologin table
     *
     * @param string $data Session data
     */
    protected function storeAutologinData($data)
    {
        // Get the user key if it's not already stored as a session variable
        if (!isset($_SESSION[$this->sess_ukey])) {
            $sql = "SELECT $this->col_ukey FROM $this->table_users
                WHERE $this->col_name = :username";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':username', $_SESSION[$this->sess_uname]);
            $stmt->execute();
            $_SESSION[$this->sess_ukey] = $stmt->fetchColumn();
        }
        // Copy the session data to the autologin table
        $sql = "UPDATE $this->table_autologin
            SET $this->col_data = :data WHERE $this->col_ukey = :key";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':data', $data);
        $stmt->bindParam(':key', $_SESSION[$this->sess_ukey]);
        $stmt->execute();
    }
}