const PlayerStream = ({ twitchUrl }) => {
    return (
      <div className="w-full flex justify-center">
        <iframe
          src={`https://player.twitch.tv/?channel=${new URL(twitchUrl).pathname.replace("/", "")}&parent=${window.location.hostname}`}
          height="450"
          width="100%"
          allowFullScreen
          className="rounded-lg shadow-lg border border-[var(--color-primary)] max-w-[900px]"
        ></iframe>
      </div>
    );
  };
  
  export default PlayerStream;
  