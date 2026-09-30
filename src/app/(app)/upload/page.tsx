"use client";
// 上传页：真实选图，压成 data-URL 再交给出图。
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18n";
import { Header, Stepper } from "@/components/ui";
import { loadState } from "@/lib/store";
import { setRefs, getRefs } from "@/lib/refs";

async function fileToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const max = 640;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * scale));
  c.height = Math.max(1, Math.round(bmp.height * scale));
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.72);
}

export default function UploadPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [shots, setShots] = useState<string[]>([]);
  const [intent, setIntent] = useState("");

  useEffect(() => {
    setShots(getRefs());
    setIntent(loadState().intent);
  }, []);

  const keep = (next: string[]) => {
    const capped = next.slice(0, 10);
    setShots(capped);
    setRefs(capped);
  };

  const addFiles = async (list: FileList | File[]) => {
    const next = [...shots];
    let failed = false;
    for (const f of Array.from(list)) {
      if (next.length >= 10) break;
      try { next.push(await fileToDataUrl(f)); }
      catch { failed = true; }
    }
    if (failed) alert(t("upload.bad"));
    keep(next);
  };

  return (
    <>
      <Header />
      <div className="page"><div className="wrap">
        <Stepper cur={2} />
        <a className="backlink" onClick={() => router.push("/create")}>← {t("common.back")}</a>
        {intent ? <div className="sumline">✨ {t("upload.readyTpl").replace("{n}", intent)}</div> : null}
        <h1 className="ptitle">{t("upload.title")}</h1>
        <label
          className="dropzone"
          style={{ marginTop: 22, display: "block" }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
          />
          <div className="dz-ic">⇪</div>
          <div className="dz-t">{t("upload.drop")}</div>
          <div className="dz-s">{t("upload.fmt")}</div>
        </label>
        <div className="tips card">
          <h3>{t("upload.tips")}</h3>
          <ul>
            <li>{t("upload.t1")}</li>
            <li>{t("upload.t2")}</li>
            <li>{t("upload.t3")}</li>
            <li>{t("upload.t4")}</li>
          </ul>
        </div>
        {shots.length > 0 && (
          <div className="thumbgrid">
            {shots.map((src, i) => (
              <div className="thumb" key={i} style={{ background: "#EFE3D0" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}
        <div className="counter">{shots.length} / 10</div>
      </div></div>
      <div className="bottom-bar"><div className="inner">
        <span className="note">{t("upload.minhint")}</span>
        <button className="btn bp" disabled={shots.length < 1} onClick={() => {
          setRefs(shots);
          router.push("/anchor");
        }}>{t("common.cont")}</button>
      </div></div>
    </>
  );
}
