import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { GridRowId, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import styles from "./UserList.module.scss";
import { Dialog } from "../../../../components/Dialog";
import { User } from "../../../../types";
import { SnackBar } from "../../../../components/Snackbar";
import { DataGrid } from "../../../../components/DataGrid";
import { UndrawNoUsersSvg } from "../../../../components/Svgs";
import { getAllUsers } from "../../api/getAllUsers";
import { deleteUser } from "../../api/deleteUser";
import { EditUser } from "../EditUser/EditUser";

type UserRow = {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  password: string;
};

export const UserList = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserRow>();
  const [userId, setUserId] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [showSuccessEditing, setShowSuccessEditing] = useState<boolean>(false);
  const [showSuccessDeleted, setShowSuccessDeleted] = useState<boolean>(false);

  const onSaveEditedUser = useRef(async (): Promise<boolean> => {
    return false;
  });

  useEffect(() => {
    const getDataUsers = () => {
      getAllUsers()
        .then((response) => {
          const users: User[] = response.data;
          const usersRows: UserRow[] = users.map((user) => ({
            id: user.id,
            username: user.username,
            password: user.password,
            roleId: user.role,
            roleName: user?.roleName ?? "",
          }));
          setUsers(usersRows);
        })
        .catch((error) =>
          console.log(`GetAllUsers not successful because: ${error}`)
        );
    };
    getDataUsers();
  }, [showSuccessEditing]);

  const onShowDeleteAlertMessage = useCallback(
    (id: GridRowId, row: UserRow) => () => {
      setUserId(+id);
      setUsername(row.username);
      setShowDeleteAlert(true);
    },
    []
  );

  const onShowEditDialog = useCallback(
    (id: GridRowId, row: UserRow) => () => {
      setUserId(+id);
      setSelectedUser(row);
      setUsername(row.username);
      setShowEditDialog(true);
    },
    []
  );

  const deleteDataUser = () => {
    deleteUser({ userId }).then(() => {});
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setShowDeleteAlert(false);
    setShowSuccessDeleted(true);
  };

  const columns = useMemo<GridColumns<UserRow>>(
    () => [
      { field: "username", type: "string", headerName: "Име", flex: 1 },
      {
        field: "roleName",
        type: "string",
        headerName: "Потребителска роля",
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Редактирай"
            onClick={onShowEditDialog(params.id, params.row)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Изтрий"
            onClick={onShowDeleteAlertMessage(params.id, params.row)}
            disabled={users.length <= 1}
          />,
        ],
      },
    ],
    [onShowEditDialog, onShowDeleteAlertMessage, users]
  );

  return (
    <div className={styles.List}>
      <Dialog
        showDialog={showDeleteAlert}
        dialogContent={`Сигурни ли сте, че искате да изтриете потребител ${username}?`}
        setShowDialog={setShowDeleteAlert}
        dialogTitle={"Внимание"}
        onAccept={deleteDataUser}
        acceptMessage={"Да"}
        cancelMessage={"Не"}
      />

      <Dialog
        className="MuiDialog-paper"
        showDialog={showEditDialog}
        dialogContent={
          <EditUser
            user={{
              id: selectedUser?.id ?? 0,
              username: selectedUser?.username ?? "",
              password: selectedUser?.password ?? "",
              role: selectedUser?.roleId ?? 1,
            }}
            onSaveEditedUser={onSaveEditedUser}
          />
        }
        setShowDialog={setShowEditDialog}
        dialogTitle={"Редакция"}
        onAccept={async () => {
          const isValid: boolean = await onSaveEditedUser.current();
          if (isValid) {
            setShowEditDialog(false);
            setShowSuccessEditing(true);
          }
        }}
        acceptMessage={"Запис"}
        cancelMessage={"Отказ"}
      />

      <SnackBar
        isOpen={showSuccessEditing}
        messages={["Успешно редактиране!"]}
        setIsOpen={setShowSuccessEditing}
        severity={"success"}
        alertTitle={""}
      />

      <SnackBar
        isOpen={showSuccessDeleted}
        messages={[`${username} е успешно премахнат.`]}
        setIsOpen={setShowSuccessDeleted}
        severity={"success"}
        alertTitle={"Успешно изтриване!"}
      />
      {users.length !== 0 ? (
        <DataGrid className={styles.DataGrid} columns={columns} rows={users} />
      ) : (
        <div className={styles.NoUsers}>
          <UndrawNoUsersSvg />
          <h5>Няма съществуващи потребители</h5>
        </div>
      )}
    </div>
  );
};
