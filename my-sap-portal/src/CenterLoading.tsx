import { Flex, Spinner } from "@chakra-ui/react";

export default function CenterLoading() {

    return <>
        <Flex minH='100vh' bg='#eee' align='center' justify='center'>
            <Spinner thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl' />
        </Flex>
    </>

}