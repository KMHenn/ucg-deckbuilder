import { useState} from "react";
import { useDisclosure } from '@mantine/hooks';
import {useAuth} from '../../auth/auth-context';
import {
    Modal,
    TextInput,
    PasswordInput,
    Button,
    Alert,
    Stack,
} from "@mantine/core";

export default function Login() {
    const {login} = useAuth();
    const [opened, {open, close}] = useDisclosure(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(username, password);
            setUsername('');
            setPassword('');
            close();
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="filled" onClick={open}>
                Login
            </Button>
            <Modal
                opened={opened}
                onClose={close}
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
        </>
    );
}
