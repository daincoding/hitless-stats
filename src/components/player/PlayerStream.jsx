const PlayerStream = ({ twitchUrl }) => {
    return (
      <div className="w-full flex justify-center">
        <iframe
          src={`https://player.twitch.tv/?channel=${new URL(twitchUrl).pathname.replace("/", "")}&parent=${window.location.hostname}`} // Twitch requires a parent parameter to prevent unauthorized embedding.
          height="450" // window.location.hostname dynamically sets the current website’s domain.
          width="100%"
          allowFullScreen
          className="rounded-lg shadow-lg border border-[var(--color-primary)] max-w-[900px]"
        ></iframe>
      </div>
    );
  };
  
  export default PlayerStream;
  