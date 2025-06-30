const Indicator = ({ pfp }: { pfp: string }) => {
    return (
        <div className="flex items-start gap-2.5 mb-3">
            <img
                className="w-8 h-8 rounded-full"
                src={`${import.meta.env.VITE_BASE_URL}/avatars/${pfp}`}
                alt="Jese image"
            />
            <div className="flex flex-col gap-1 w-fit">
                <div
                    className={`flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-200 rounded-e-xl rounded-es-xl`}
                >
                    <div
                        className={`text-sm font-normal text-gray-900`}
                    >
                        <div className="ticontainer">
                            <div className="tiblock">
                                <div className="tidot"></div>
                                <div className="tidot"></div>
                                <div className="tidot"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Indicator