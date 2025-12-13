import { useState } from "react";
import {
    Modal,
    TextInput,
    PasswordInput,
    Button,
    Alert,
    Stack,
} from "@mantine/core";
import {api} from '../../lib/api';

export default function LoginModal({ opened, onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

   const handleSubmit = async () => {
    console.log('starting login attempt');
        setLoading(true);
        setError(null);

        try {
            // Get CSRF cookie
            await api.get('/sanctum/csrf-cookie');
            console.log('CSRF got');

            // Login
            console.log('logging in');
            const res = await api.post('/login', {
                username,
                password,
            });

            console.log('Logged in user:', res.data.user);
            // update global auth state here
        } catch (err: any) {
            console.log(err.response?.data?.message ?? 'unknown error');
            setError(err.response?.data?.message ?? 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Log in"
            centered
            radius="lg"
        >
            <form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <TextInput
                        label="Username"
                        placeholder="Your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        radius="md"
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        radius="md"
                    />

                    {error && (
                        <Alert color="red" radius="md">
                            {error}
                        </Alert>
                    )}

                    <Button type="submit" radius="md" loading={loading} fullWidth>
                        Log in
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
