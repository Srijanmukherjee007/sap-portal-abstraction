import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Select,
} from "@chakra-ui/react";
import { useState } from "react";
import PasswordInput from "./PasswordInput";

export interface LoginProps {
    onSubmit?: Function;
}

export default function Login({ onSubmit }: LoginProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [year, setYear] = useState<string>("Y21_22");
    const [session, setSession] = useState<string>("Spring");
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    const handleSubmit = () => {
        if (username.length < 8) return setUsernameError(true);
        if (password.length < 5) return setPasswordError(true);
        if (onSubmit) onSubmit(username, password, year, session);
    };

    return (
        <>
            <Flex
                minH="100vh"
                bg="#eee"
                align="center"
                justify="center"
                direction="column"
            >
                <Box bg="white" boxShadow="lg" padding="6" borderRadius="md">
                    <Heading size="lg" marginBottom="20px">
                        KIIT Attendance
                    </Heading>

                    <FormControl
                        marginBottom="10px"
                        isInvalid={usernameError && username.length < 8}
                    >
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        {usernameError ? (
                            <FormErrorMessage>
                                username must be atleast 8 letters
                            </FormErrorMessage>
                        ) : null}
                    </FormControl>
                    <FormControl
                        marginBottom="10px"
                        isInvalid={passwordError && password.length < 5}
                    >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <PasswordInput
                            id="password"
                            passwordChange={(val: string) => setPassword(val)}
                        />

                        {passwordError ? (
                            <FormErrorMessage>
                                password must be atleast 5 letters
                            </FormErrorMessage>
                        ) : null}
                    </FormControl>
                    <FormControl marginBottom="10px">
                        <FormLabel htmlFor="year">Year</FormLabel>
                        <Select
                            id="year"
                            value={year}
                            onChange={(event) => setYear(event.target.value)}
                        >
                            <option value="Y20_21">2020-2021</option>
                            <option value="Y21_22">2021-2022</option>
                            <option value="Y22_23">2022-2023</option>
                            <option value="Y23_24">2023-2024</option>
                        </Select>
                    </FormControl>
                    <FormControl marginBottom="10px">
                        <FormLabel htmlFor="session">Session</FormLabel>
                        <Select
                            id="session"
                            value={session}
                            onChange={(event) => setSession(event.target.value)}
                        >
                            <option value="Spring">Spring</option>
                            <option value="Autumn">Autumn</option>
                        </Select>
                    </FormControl>

                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Get attendance
                    </Button>
                </Box>
            </Flex>
        </>
    );
}
