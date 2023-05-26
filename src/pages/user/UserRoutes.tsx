import User from "./User.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
const UserRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path=":username" element={<User />} />
        </Routes>
    );
};

export default UserRoutes;