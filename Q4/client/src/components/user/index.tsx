import React, { FC } from "react";
import Container from "components/Container";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "redux/app/actions";
import { User } from "redux/app/reducer";
import Modal from "react-bootstrap/Modal";
import { Form, Input, Button } from 'antd';

interface UserProps {
    show: boolean;
    user: User;
    action:  string;
    hideModal: () => void;
}

const User: FC<UserProps> = (props: UserProps) => {
    const { show, user, action, hideModal } = props;
    
    const dispatch = useDispatch();

    const onFinish = (values: any) => {
        if (action == 'add') dispatch(addUser(values));
        else {
            values.id = user.id;
            dispatch(updateUser(values));
        }

        hideModal();
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Container className="userForm">
            <Modal show={show} onHide={hideModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {action == 'add' ? <h4>Add User</h4> : <h4>Edit User</h4>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        name="user"
                        initialValues={user}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input name' }]}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input email', type: 'email' }]}
                        >
                            <Input placeholder="email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input phone number' }]}
                        >
                            <Input placeholder="phone" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input address' }]}
                        >
                            <Input placeholder="address" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {action == "add" ? "Create" : "Save"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default User;