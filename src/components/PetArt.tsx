// 宠物 SVG 头像（Mock 视觉资产；真实生成图以 <img> 呈现）
export function DogFace() {
  return (
    <g>
      <ellipse cx="55" cy="60" rx="28" ry="38" fill="#B57A3D" transform="rotate(-15 55 60)" />
      <ellipse cx="145" cy="60" rx="28" ry="38" fill="#B57A3D" transform="rotate(15 145 60)" />
      <ellipse cx="100" cy="105" rx="62" ry="58" fill="#E3A857" />
      <ellipse cx="100" cy="132" rx="30" ry="22" fill="#F6E3C5" />
      <circle cx="78" cy="95" r="7" fill="#3D2E24" /><circle cx="122" cy="95" r="7" fill="#3D2E24" />
      <ellipse cx="100" cy="124" rx="10" ry="7" fill="#3D2E24" />
      <path d="M92 134 Q100 142 108 134" stroke="#3D2E24" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}
export function CatFace() {
  return (
    <g>
      <polygon points="40,62 55,20 78,52" fill="#7E838C" /><polygon points="160,62 145,20 122,52" fill="#7E838C" />
      <ellipse cx="100" cy="108" rx="60" ry="55" fill="#9AA0A8" />
      <circle cx="80" cy="98" r="6" fill="#3D2E24" /><circle cx="120" cy="98" r="6" fill="#3D2E24" />
      <ellipse cx="100" cy="114" rx="7" ry="5" fill="#E0715C" />
      <path d="M58 116 L28 110 M58 124 L30 126 M142 116 L172 110 M142 124 L170 126" stroke="#5B5F66" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
export function RoyalFrame() {
  return (
    <>
      <ellipse cx="100" cy="103" rx="92" ry="96" fill="#D4A857" />
      <ellipse cx="100" cy="103" rx="84" ry="88" fill="#54382C" />
    </>
  );
}
export function PetSvg({ dog, royal, size = "100%" }: { dog: boolean; royal?: boolean; size?: string }) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: size, margin: "0 auto" }}>
      {royal ? <RoyalFrame /> : null}
      {dog ? <DogFace /> : <CatFace />}
    </svg>
  );
}
