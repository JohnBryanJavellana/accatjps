import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GuestRoute from './route/GuestRoute';
import AccessDenied from './pages/AccessDenied';

import GuestWrapper from './pages/guest/components/GuestWrapper/GuestWrapper';

import Home from './pages/guest/Home/Home';
import EmailVerification from "./pages/guest/EmailVerification/EmailVerification";
import SubmitEmail from "./pages/guest/ForgotPassword/SubmitEmail/SubmitEmail";
import ResetPassword from "./pages/guest/ForgotPassword/ResetPassword/ResetPassword";
import PrivateRoute from "./route/PrivateRoute";
import ManageAccount from "./pages/authenticated/alumni/ManageProfile/ManageAccount";
import EmployerLogin from "./pages/guest/Login/Employer/EmployerLogin";
import AlumniLogin from "./pages/guest/Login/Alumni/AlumniLogin";
import AlumniRegistration from "./pages/guest/Registration/Alumni/AlumniRegistration";
import EmployerRegistration from "./pages/guest/Registration/Employer/EmployerRegistration";
import EmployerMenu from "./pages/authenticated/employer/components/EmployerMenu/EmployerMenu";
import AlumniMenu from "./pages/authenticated/alumni/components/AlumniMenu/AlumniMenu";
import EManageAccount from "./pages/authenticated/employer/ManageProfile/EManageAccount";
import AdminMenu from "./pages/authenticated/admin/components/AdminMenu/AdminMenu";
import ADashboard from "./pages/authenticated/admin/dashboard/ADashboard";
import AUserManagement from "./pages/authenticated/admin/user-management/AUserManagement";
import AManageAccount from "./pages/authenticated/admin/ManageProfile/AManageAccount";
import JobAds from "./pages/authenticated/employer/jobs/JobAds";
import CreateJobAd from "./pages/authenticated/employer/jobs/CreateJobAd";
import AJP from "./pages/authenticated/alumni/jobs/AJP";
import ViewJobPost from "./pages/authenticated/employer/jobs/ViewJobPost";
import Jobs from "./pages/guest/Jobs/Jobs";
import InfoBoard from "./pages/guest/InfoBoard/InfoBoard";
import Gallery from "./pages/guest/Gallery/Gallery";
import AboutUs from "./pages/guest/AboutUs/AboutUs";
import SystemSettings from "./pages/authenticated/admin/system-settings/SystemSettings";
import AAnnouncement from "./pages/authenticated/admin/announcement/AAnnouncement";
import NewsFeed from "./pages/authenticated/alumni/news-feed/NewsFeed";
import EReport from "./pages/authenticated/report/EReport";
import AlReport from "./pages/authenticated/alumni/report/AlReport";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<GuestRoute />}>
                    <Route element={<GuestWrapper />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/info-board" element={<InfoBoard />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/about" element={<AboutUs />} />

                        <Route path="/alumni/login" element={<AlumniLogin />} />
                        <Route path="/alumni/create-account" element={<AlumniRegistration />} />
                        <Route path="/employer/login" element={<EmployerLogin />} />
                        <Route path="/employer/create-account" element={<EmployerRegistration />} />
                        <Route path="/verify/:uid/:token" element={<EmailVerification />} />
                        <Route path="/forgot-password" element={<SubmitEmail />} />
                        <Route path="/password-reset-confirm/:uid/:token" element={<ResetPassword />} />
                    </Route>
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route element={<AdminMenu />}>
                        <Route path="/welcome/administrator" element={<ADashboard />} />
                        <Route path="/welcome/administrator/announcement" element={<AAnnouncement />} />
                        <Route path="/welcome/administrator/user-management" element={<AUserManagement />} />
                        <Route path="/welcome/administrator/system-settings" element={<SystemSettings />} />
                        <Route path="/welcome/administrator/manage-account" element={<AManageAccount />} />
                    </Route>

                    <Route element={<AlumniMenu />}>
                        <Route path="/welcome/alumni/" element={<Home />} />
                        <Route path="/welcome/report/" element={<AlReport />} />
                        <Route path="/welcome/news-feed/" element={<NewsFeed />} />
                        <Route path="/welcome/alumni/jobs" element={<AJP />} />
                        <Route path="/welcome/alumni/info-board" element={<InfoBoard />} />
                        <Route path="/welcome/alumni/gallery" element={<Gallery />} />
                        <Route path="/welcome/alumni/about" element={<AboutUs />} />
                        <Route path="/welcome/alumni/manage-account" element={<ManageAccount />} />
                    </Route>

                    <Route element={<EmployerMenu />}>
                        <Route path="/welcome/employer/" element={<Home />} />
                        <Route path="/welcome/employer/report/" element={<EReport />} />
                        <Route path="/welcome/employer/jobs" element={<JobAds />} />
                        <Route path="/welcome/employer/jobs/:jobId" element={<ViewJobPost />} />
                        <Route path="/welcome/employer/jobs/create" element={<CreateJobAd />} />
                        <Route path="/welcome/employer/info-board" element={<InfoBoard />} />
                        <Route path="/welcome/employer/gallery" element={<Gallery />} />
                        <Route path="/welcome/employer/about" element={<AboutUs />} />
                        <Route path="/welcome/employer/manage-account" element={<EManageAccount />} />
                    </Route>
                </Route>

                <Route path="*" element={<AccessDenied />} />
            </Routes>
        </Router>
    );
}

export default App;
