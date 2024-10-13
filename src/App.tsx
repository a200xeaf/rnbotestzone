import {BrowserRouter, Route, Routes} from "react-router-dom";
import MidiTest from "./nodesource/MidiTest.tsx";
import DataTest from "./datasource/DataTest.tsx";
import DrawTest from "./p5source/DrawTest.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MidiTest />} />
                <Route path="/data" element={<DataTest />} />
                <Route path="/draw" element={<DrawTest />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App
