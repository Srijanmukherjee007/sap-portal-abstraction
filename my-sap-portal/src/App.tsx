import { WarningTwoIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import CenterLoading from "./CenterLoading";
import Login from "./Login";
import Result from "./Result";

const API_URL = "http://localhost:8080/attendance";

enum AppState { LOGIN, LOADING, RESULT, ERROR }

export interface Student {
  name: string;
  school: string;
  program: string;
  rollno: string;
  semester: string;
  regno: string;
  img: string;
}

export interface Attendance {
  subject: string,
  facultyName: string,
  facultyCode: string,
  totalClasses: number,
  absents: number,
  excuses: number,
  presents: number,
  percentage: number,
  percentageWithExcuses: number
}

export interface StudentAttendance {
  student: Student,
  attendances: Attendance[]
}

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);
  const [attendanceDetails, setAttendanceDetails] = useState<StudentAttendance | null>(null);

  useEffect(() => {
    if (appState === AppState.LOADING && attendanceDetails !== null) {
      setAppState(AppState.RESULT);
    }
  }, [attendanceDetails])

  const loadData = (username: string, password: string, year: string, session: string) => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ username, password, year, session })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return setAppState(AppState.ERROR);
        }

        setAttendanceDetails(res);
      })
      .catch(err => {
        setAppState(AppState.ERROR);
      })
  }

  const onSubmit = (
    username: string,
    password: string,
    year: string,
    session: string
  ) => {
    setAppState(AppState.LOADING);
    loadData(username, password, year, session);
  };

  return (
    <div className="App">
      {appState === AppState.LOGIN ? <Login onSubmit={onSubmit} /> : null}
      {appState === AppState.LOADING ? <CenterLoading /> : null}
      {appState === AppState.RESULT && attendanceDetails !== null ? <Result goBack={() => { setAppState(AppState.LOGIN) }} studentAttendance={attendanceDetails} /> : null}
      {appState === AppState.ERROR ? (
        <Flex minH="100vh" align="center" justify="center" bg="#eee" direction="column">
          <Icon as={WarningTwoIcon} color="red.500" w={8} h={8} marginBottom="10px" />
          <Heading size="lg" marginBottom="20px">something went wrong</Heading>
          <Button colorScheme='teal' variant='outline' onClick={() => setAppState(AppState.LOGIN)}>Back</Button>
        </Flex>) : null}
    </div>
  );
}

export default App;
