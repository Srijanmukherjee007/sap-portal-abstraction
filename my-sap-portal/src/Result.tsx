import { Box, Button, Center, Divider, Flex, Heading, Image, Progress, Text, VStack } from "@chakra-ui/react";
import { Attendance, Student, StudentAttendance } from "./App";

export interface ResultProps {
    studentAttendance: StudentAttendance;
    goBack: Function;
}

interface StudentViewProps {
    student: Student;
}

interface AttendancesViewProps {
    attendances: Attendance[];
}

interface AttendanceViewProps {
    attendance: Attendance;
}

function StudentView({ student }: StudentViewProps) {
    return <Flex p={2} borderRadius='md' gap={2} boxShadow='lg' bg='white' flexWrap='wrap' align='center'>
        <Box w={{ base: '100%', sm: 'auto', md: 'auto', lg: 'auto' }}>
            <Center>

                <Box maxWidth={'128px'}>
                    <Image src={student.img} w='100%' />
                </Box>
            </Center>
        </Box>
        <Box>
            <VStack align='left'>
                <Text fontSize='sm'>Name: {student.name}</Text>
                <Text fontSize='sm'>Roll: {student.rollno}</Text>
                <Text fontSize='sm'>School: {student.school}</Text>
                <Text fontSize='sm'>Program: {student.program}</Text>
                <Text fontSize='sm'>Regno.: {student.regno || "NA"}</Text>
            </VStack>
        </Box>
    </Flex>
}

function AttendanceView({ attendance }: AttendanceViewProps) {
    console.log(attendance);
    return <Box marginBottom={0} p={3}>
        <Box cursor='default' marginBottom={1}>
            <Text fontWeight={600}>{attendance.subject} <Text as='span' fontWeight={50} fontSize='sm'>{attendance.percentageWithExcuses}%</Text></Text>
            <Text fontSize='xs' title='Faculty name'>{attendance.facultyName}</Text>
            <Text fontSize='xs' title='Faculty code'>{attendance.facultyCode}</Text>
        </Box>
        <Box fontSize='xs'>
            <Text>Classes attended: {attendance.presents} / {attendance.totalClasses}</Text>
            <Text>Excuses: {attendance.excuses}</Text>
        </Box>
    </Box>;
}

function AttendancesView({ attendances }: AttendancesViewProps) {
    return <Box bg='white' boxShadow='md' borderRadius={'md'} p={2}>
        <Heading size='md' marginBottom='20px'>Attendance Details</Heading>

        {attendances.length === 0 ? <>
            <Center marginBottom="20px">
                <Text size="sm" color="red.500">No attendance detail found</Text>
            </Center>
        </> : <>
            <Box>
                {attendances.map((attendance, index) => <><AttendanceView attendance={attendance} key={`${index}${attendance.facultyName}`} /> {index < attendances.length - 1 ? <Divider /> : null}</>)}
            </Box>
        </>}

    </Box>
}

export default function Result({ studentAttendance, goBack }: ResultProps) {
    return <>
        <Flex bg='#eee' gap={4} minH="100vh" direction='column' p={2}>
            <Button colorScheme='teal' variant='outline' onClick={() => { goBack() }} w={{ base: '100%', sm: '5em', md: '5em', lg: '5em' }}>Back</Button>
            <StudentView student={studentAttendance.student} />
            <AttendancesView attendances={studentAttendance.attendances} />
        </Flex>
    </>
}