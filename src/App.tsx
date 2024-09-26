import {BrowserRouter, Route, Routes} from "react-router-dom";
import MidiTest from "./nodesource/MidiTest.tsx";
import DataTest from "./datasource/DataTest.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MidiTest />} />
                <Route path="/data" element={<DataTest />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App
