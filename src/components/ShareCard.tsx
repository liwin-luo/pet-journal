export function ShareCard({
  kind, petName, text, image, date, mark,
}: {
  kind: "work" | "diary";
  petName: string;
  text: string;
  image: string;
  date: number;
  mark?: boolean;
}) {
  const when = new Date(date).toLocaleDateString();
  return (
    <article className="share-card">
      <div className="frame">
        {image ? <img src={image} alt="" /> : <span className="mark">PetsDaily</span>}
        {mark && image ? <span className="wm">PetsDaily</span> : null}
      </div>
      <div className="body">
        <div className="kicker">{kind === "diary" ? when : "PetsDaily"}</div>
        <h1>{petName || "PetsDaily"}</h1>
        {kind === "diary" && text ? <p className="prose">{text}</p> : null}
        {kind === "work" ? <div className="by">{when}</div> : null}
      </div>
    </article>
  );
}
