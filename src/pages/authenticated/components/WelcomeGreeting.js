const WelcomeGreeting = ({ name, className }) => {
    const currentHour = new Date().getHours();
    let greeting = "";
    if (currentHour < 12) { greeting = "Good Morning"; }
    else if (currentHour < 18) { greeting = "Good Afternoon"; }
    else { greeting = "Good Evening"; }

    return (
        <div className={className}>
            <span className="greeting">{greeting},</span> {name}!
        </div>
    )
}

export default WelcomeGreeting;