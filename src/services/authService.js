import http from '../services/httpService'

const api = 'http://localhost:5000/api/login'

export async function login(email, password) {
  await http.post(api, { email, password })
}

// <Form.Item
// label="Username"
// name="username"
// rules={[{ required: true, message: 'Please input your username!' }]}
// >
// <Input
//   onChange={this.handleChange}
//   autoFocus
//   size="large"
//   style={{ borderRadius: '10px' }}
// />
// </Form.Item>

// <Form.Item
// label="Password"
// name="password"
// rules={[{ required: true, message: 'Please input your password!' }]}
// >
// <Input.Password
//   onChange={this.handleChange}
//   size="large"
//   style={{ borderRadius: '10px' }}
// />
// </Form.Item>
