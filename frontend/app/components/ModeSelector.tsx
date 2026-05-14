type Props = {
  mode: string;
  setMode: (m: string) => void;
};

export default function ModeSelector({ mode, setMode }: Props) {
  return (
    <div>
      <button onClick={() => setMode("self")}>Self Custody</button>

      <button onClick={() => setMode("managed")}>AI Managed</button>
    </div>
  );
}
