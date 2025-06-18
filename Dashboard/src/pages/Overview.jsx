import Sidebar from "../components/sidebar/Sidebar";


const Overview = () => {
    return (
        <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold mb-4">Overview</h1>
            <p>This is the overview page.</p>
        </div>
        </div>
    );
    }

export default Overview;