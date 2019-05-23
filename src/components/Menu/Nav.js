import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import apiCall from '../../utils/apiCall';
import { Menu, Drawer, message, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            loading: '',
            showFormLogin: false,
            showFormRegister: false,
            username_register: '',
            password_register: '',
            repassword_register: '',
            firstname_register: '',
            lastname_register: '',
            email: '',
            isRegister: false

        };
    }
    Login = (e) => {
        e.preventDefault();
        //console.log(this.state);
        this.setState({ loading: 'Đợi xíu, kiểm tra đã....' });
        var { username, password } = this.state;
        apiCall('login', 'POST', {
            username: username,
            password: password
        }).then(res => {
            let acc = res.data;
            const firstName = acc.firstName;
            const lastName = acc.lastName;
            const name = lastName + " " + firstName;

            console.log(name);

            localStorage.setItem("name", name);

            this.setState({ isLogin: true })
            //this.setState({username: '',password:'', loading:''});

            localStorage.setItem("ACCESSTOKEN", true);
            if (this.state.isLogin) {
                message.success('Bạn đã đăng nhập thành công', 1);
                this.setState({ showFormLogin: false })
            }
        }).catch(e => {
            this.setState({ loading: 'Sai thông tin đăng nhập!' });
        })
    }
    Register = (e) => {
        e.preventDefault();
        console.log(this.state);
        var { username_register, password_register, repassword_register, firstname_register, lastname_register, email } = this.state;
        var error = true;
        if (username_register === '') {
            this.setState({ err_username: ' User name không được rỗng' })
            error = false;
        } else {
            this.setState({ err_username: '' })
        }
        if (password_register === '') {
            this.setState({ err_password: 'Password không được rỗng' })
            error = false;
        } else {
            this.setState({ err_password: '' })
        }
        if (repassword_register !== password_register) {
            this.setState({ err_repassword: 'Pass không trùng' })
            error = false;
        } else {
            this.setState({ err_repassword: '' })
        }
        if (firstname_register === '') {
            this.setState({ err_firstname: 'First name không được rỗng' })
            error = false;
        } else {
            this.setState({ err_firstname: '' })
        }
        if (lastname_register === '') {
            this.setState({ err_lastname: 'Last name không được rỗng' })
            error = false;
        } else {
            this.setState({ err_lastname: '' })
        }
        if (email === '') {
            this.setState({ err_email: 'Email không được rỗng' })
            error = false;
        } else {
            this.setState({ err_email: '' })
        }
        apiCall('users/checkemail', 'POST', {
            email: email
        }).then(res => {
            //console.log(res.data);
            if (res.data === 'Email already') {
                this.setState({ err_email: 'Email đã tồn tại trong hệ thống' })
                error = false;
            } else {
                if (error) {
                    apiCall('users/register', 'POST', {
                        username: username_register,
                        password: password_register,
                        firstName: firstname_register,
                        lastName: lastname_register,
                        email: email
                    }).then(res2 => {
                        console.log(res2.data);
                        this.setState({ isRegister: true });
                        if (this.state.isRegister) {
                            message.success('Bạn đã ký thành thành công', 1);
                            
                            this.setState({ showFormRegister: false })
                        }
                    })
                }
            }
        })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        //console.log(this.state);
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
        if (e.key === 'login') {
            this.setState({
                showFormLogin: true,
            });
        }
        if (e.key === 'logout') {
            this.setState({ user_id: '' });
            localStorage.clear();
            message.success('Bạn đã đăng xuất thành công', 1);
        }
        if (e.key === 'register') {
            this.setState({
                showFormRegister: true,
            });
        }
    }
    onCloseFormLogin = () => {
        this.setState({
            showFormLogin: false,
            loading: '',
            username: '',
            password: '',
        });
    };
    onCloseFormRegister = () => {
        this.setState({
            showFormRegister: false,
            loading: '',
            username_register: '',
            password_register: '',
            repassword_register: '',
            firstname_register: '',
            lastname_register: '',
            email: '',
        });
    };
    render() {
        const isLogin = localStorage.getItem("ACCESSTOKEN");
        const name = localStorage.getItem("name");
        //console.log(firstName);
        return (
            <div className="as">
                <Menu
                    onClick={this.handleClick}
                    mode="horizontal"
                >
                    <Menu.Item key="mail">
                        <Link to="/">Trang chủ</Link>
                    </Menu.Item>
                    <Menu.Item key="app">
                        <Link to="/about">Giới thiệu</Link>
                    </Menu.Item>
                    {
                        (isLogin) ?
                            <SubMenu title={<span className="submenu-title-wrapper" style={{ color: 'red' }}> Xin chào:  {(name)}<Icon type="caret-down" /></span>}>
                                <Menu.Item title="Item 1" key="logout">
                                    Đăng xuất
                                </Menu.Item>
                            </SubMenu> :
                            <Menu.Item key="login">
                                Đăng nhập
                            </Menu.Item>
                    }
                    {
                        (isLogin) ?
                            <li style={{ listStyle: 'none' }}></li> :
                            <Menu.Item key="register">
                                Đăng ký
                        </Menu.Item>
                    }
                </Menu>
                <Drawer
                    title="Đăng nhập"
                    placement="right"
                    closable={true}
                    onClose={this.onCloseFormLogin}
                    visible={this.state.showFormLogin}
                    width={300}
                >
                    <form className="form-horizontal" onSubmit={this.Login} id="FormLogin">
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Username:</label>
                            <div>
                                <input type="text" className="form-control" id="email" name="username" value={this.state.username} onChange={this.onChange} placeholder="Enter email" />

                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="pwd">Password:</label>
                            <div>
                                <input type="password" className="form-control" id="pwd" name="password" value={this.state.password} onChange={this.onChange} placeholder="Enter password" />
                            </div>
                        </div>
                        <div className="form-group1">
                            <div className="">
                                <button type="submit" className="btn btn-default" onClick={this.onClick}>Submit</button>
                            </div>
                        </div>
                        <p style={{ color: 'red' }}>{this.state.loading}</p>
                    </form>
                </Drawer>
                <Drawer
                    title="Đăng ký"
                    placement="right"
                    closable={false}
                    onClose={this.onCloseFormRegister}
                    visible={this.state.showFormRegister}
                    width={350}
                >
                    <form className="form-horizontal" onSubmit={this.Register}>
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Tên đăng nhập:</label>
                            <div>
                                <input type="text"  className="form-control" id="email" name="username_register" value={this.state.username_register} onChange={this.onChange} placeholder="Enter email" />
                                <div style={{ color: 'red' }}>{this.state.err_username}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="pwd">Mật khẩu:</label>
                            <div>
                                <input type="password" className="form-control" id="pwd" name="password_register" value={this.state.password_register} onChange={this.onChange} placeholder="Enter password" />
                                <div style={{ color: 'red' }}>{this.state.err_password}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="pwd">Nhập lại mật khẩu:</label>
                            <div>
                                <input type="password" className="form-control" id="pwd" name="repassword_register" value={this.state.repassword_register} onChange={this.onChange} placeholder="Enter password" />
                                <div style={{ color: 'red' }}>{this.state.err_repassword}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Firstname:</label>
                            <div>
                                <input type="text" className="form-control" id="email" name="firstname_register" value={this.state.firstname_register} onChange={this.onChange} placeholder="Enter email" />
                                <div style={{ color: 'red' }}>{this.state.err_firstname}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Lastname:</label>
                            <div>
                                <input type="text" className="form-control" id="email" name="lastname_register" value={this.state.lastname_register} onChange={this.onChange} placeholder="Enter email" />
                                <div style={{ color: 'red' }}>{this.state.err_lastname}</div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label" htmlFor="email">Email:</label>
                            <div>
                                <input type="text" className="form-control" id="email" name="email" value={this.state.email} onChange={this.onChange} placeholder="Enter email" />
                                <div style={{ color: 'red' }}>{this.state.err_email}</div>
                            </div>
                        </div>
                        <div className="form-group1">
                            <div className="">
                                <button type="submit" loading={this.state.iconLoading} className="btn btn-default" >Submit</button>
                            </div>
                        </div>
                        <p style={{ color: 'red' }}>{this.state.loading}</p>
                    </form>
                </Drawer>
            </div>
        );
    }
}

export default Nav;