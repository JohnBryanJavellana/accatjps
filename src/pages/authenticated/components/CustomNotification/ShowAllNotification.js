import Notification from './Notification'

const ShowAllNotification = () => {
    return (
        <>
            <section className="content my-2">
                <div className="">
                    <h6 className='text-bold'>Notifications</h6>
                </div>
            </section>

            <section className="content">
                <div className="">
                    <div className="card elevation-0 border-0 bg-white">
                        <div className="card-body">
                            <Notification limit={null} onMainPage={true} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ShowAllNotification