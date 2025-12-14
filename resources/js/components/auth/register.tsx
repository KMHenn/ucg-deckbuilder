import { useState } from "react";
import {useAuth} from '../../auth/auth-context';
import { useDisclosure } from '@mantine/hooks';
import {
    Modal,
    TextInput,
    PasswordInput,
    Button,
    Alert,
    Stack,
} from "@mantine/core";

export default function RegisterModal() {
    const {register} = useAuth();
    const [opened, {open, close}] = useDisclosure(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await register(username, password, passwordConfirmation);
            setUsername('');
            setPassword('');
            setPasswordConfirmation('');
            close();
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="subtle" onClick={open}>
                Register
            </Button>
            <Modal
                opened={opened}
                onClose={close}
                title="Register"
                centered
                radius="lg"
            >
                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <TextInput
                            label="Username"
                            placeholder="Choose a username"
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

                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Repeat password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            radius="md"
                        />

                        {error && (
                            <Alert color="red" radius="md">
                                {error}
                            </Alert>
                        )}

                        <Button type="submit" radius="md" loading={loading} fullWidth>
                            Create account
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
