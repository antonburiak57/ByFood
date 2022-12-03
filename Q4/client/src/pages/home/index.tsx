import React, { useState, useEffect } from "react";
import Container from "components/Container";
import UserModal from "components/user";
import { User } from "redux/app/reducer";
import { getUsers, deleteUser } from "redux/app/actions";
import { useSelector, useDispatch } from "react-redux";
import { getAppState } from "redux/app/selectors";
import { Table, Button } from 'antd';

const Home = () => {
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>();
  const [visibleModal, setVisibleModal] = useState(false);
  const [action, setAction] = useState('');

  const dispatch = useDispatch();
  const { users } = useSelector(
    getAppState
  );

  // Data grid structure
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    }
  ];

  // Get all users
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  // Get row data when select record
  const rowSelection = {
    selectedRows: setSelectedMembers,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      setSelectedMembers(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  const clearTable = () => {
    setSelectedMembers([]);
    setSelectedRowKeys([]);
  };

  const hideModal = () => {
    setVisibleModal(false);
    clearTable();
  };

  const showModal = (action: string) => {
    if (action == 'edit' && !selectedMembers.length) return;

    setAction(action);
    setVisibleModal(true);
  };

  const removeUser = () => {
    if (selectedMembers.length) {
      dispatch(deleteUser(selectedMembers[0].id));
      clearTable();
    }
  };

  return (
    <Container className="p-4 mt-4">
        <h1 className="text-center mb-4">User Management</h1>
        <div className="d-flex justify-content-end mb-4">
          <Button type="primary" onClick={() => { showModal('add'); }}>New User</Button>
        </div>
        <Table
            rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
            columns={columns}
            dataSource={users}
        />
        <div className="d-flex justify-content-end">
          <div className="m-4">
            <Button type="primary" onClick={() => { showModal('edit'); }} disabled={selectedMembers.length ? false : true}>Edit</Button>
          </div>
          <div className="m-4">
            <Button type="primary" onClick={removeUser} disabled={selectedMembers.length ? false : true}>Delete</Button>
          </div>
        </div>
        <UserModal show={visibleModal} hideModal={hideModal} user={selectedMembers[0]} action={action} />
    </Container>
  );
};

export default Home;
