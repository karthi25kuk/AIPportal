function Adminlogin() {
    return (
        <>
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center justify-center rounded-lg p-10 gap-4 w-full max-w-md bg-gray-950 text-center">
                <h1 className="text-3xl font-bold text-blue-600">AIP portal</h1>
                <p className="text-slate-300">
                    Welcome back! Please enter your credentials to access.
                </p>
                <form className="flex flex-col gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Enter Admin ID"
                        className="input input-bordered w-full bg-slate-500/20 text-white py-2 px-4 rounded-lg"
                    />  
                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="input input-bordered w-full bg-slate-500/20 text-white py-2 px-4 rounded-lg"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition hover:scale-105 rounded-lg shadow-sm">
                        Login
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}
export default Adminlogin;