import Notification from './Notification'

const ShowAllNotification = () => {
    return (
        <>
            <section className="content my-2">
                <div className="">
                    <h4 className='text-bold'>Notifications</h4>
                </div>
            </section>

            <section className="content mt-3">
                <div className="">
                    <div className="card elevation-0 border-0 bg-white">
                        <div className="card-body text-sm">
                            <Notification limit={null} onMainPage={true} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ShowAllNotification