    import { useEffect, useRef } from "react";

    export default function Doom() {
    const dosRef = useRef<HTMLDivElement>(null);
    const dosInstanceRef = useRef<any>(null);

    const loadJsDos = (): Promise<any> => {
        return new Promise((resolve, reject) => {
        if ((window as any).Dos) {
            resolve((window as any).Dos);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://js-dos.com/6.22/current/js-dos.js";
        script.onload = () => {
            if ((window as any).Dos) {
            resolve((window as any).Dos);
            } else {
            reject(new Error("js-dos failed to load"));
            }
        };
        script.onerror = () => reject(new Error("Failed to load js-dos script"));
        document.head.appendChild(script);
        });
    };

    useEffect(() => {
        const initDoom = async () => {
        if (!dosRef.current) return;

        try {
            const Dos = await loadJsDos();

            const canvas = document.createElement("canvas");
            canvas.style.imageRendering = "pixelated";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.minHeight = "85vh";
            dosRef.current.innerHTML = "";
            dosRef.current.appendChild(canvas);

            const dos = await Dos(canvas, {
            wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
            });

            dosInstanceRef.current = dos;

            try {
            await dos.fs.extract("/apps/doom/doom.jsdos");

            let executed = false;

            try {
                await dos.main(["DOOM.EXE"]);
                executed = true;
                console.log("Successfully started DOOM");
            } catch (e) {
                console.log(`Failed to run DOOM:`, e);
            }

            if (executed) return;
            } catch (e) {
            console.log("No .jsdos bundle found, trying zip method:", e);
            }

            try {
            await dos.fs.extract("/apps/doom/doom.zip");
            let executed = false;

            try {
                await dos.main(["DOOM.EXE"]);
                executed = true;
                console.log("Successfully started DOOM");
            } catch (e) {
                console.log(`Failed to run DOOM:`, e);
            }

            if (!executed) {
                throw new Error("Could not find or execute DOOM executable");
            }
            } catch (zipError) {
            console.error("Zip method failed:", zipError);
            throw zipError;
            }
        } catch (error) {
            console.error("Failed to initialize DOOM:", error);

            if (dosRef.current) {
            dosRef.current.innerHTML = `
                <div style="color: #ff6b6b; text-align: center; padding: 40px; font-family: 'Courier New', monospace; background: #1a1a1a; border: 2px solid #333; border-radius: 8px; margin: 20px;">
                <h2 style="color: #ff4757; margin-bottom: 20px; font-size: 24px;">⚠️ DOOM Loading Failed</h2>
                <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                    <p style="margin-bottom: 15px; color: #ffa502;"><strong>Error:</strong> ${
                    error instanceof Error ? error.message : "Unknown error"
                    }</p>
                    
                    <h3 style="color: #26de81; margin-top: 30px; margin-bottom: 15px;">📁 Required Files:</h3>
                    <p style="margin-bottom: 10px;">Place DOOM game files in your <code style="background: #2c2c2c; padding: 2px 6px; border-radius: 3px;">/public/apps/doom/</code> directory:</p>
                    <ul style="text-align: left; margin-left: 20px; line-height: 1.6;">
                    <li><strong>Option 1:</strong> <code style="background: #2c2c2c; padding: 2px 6px; border-radius: 3px;">doom.jsdos</code> (pre-built bundle)</li>
                    <li><strong>Option 2:</strong> <code style="background: #2c2c2c; padding: 2px 6px; border-radius: 3px;">doom.zip</code> containing:
                        <ul style="margin-left: 20px; margin-top: 5px;">
                        <li><code>doom.exe</code> or <code>DOOM.EXE</code></li>
                        <li><code>doom.wad</code> or <code>DOOM1.WAD</code></li>
                        <li>Other game files</li>
                        </ul>
                    </li>
                    </ul>
                    
                    <h3 style="color: #26de81; margin-top: 30px; margin-bottom: 15px;">🎮 Getting DOOM Files:</h3>
                    <ul style="text-align: left; margin-left: 20px; line-height: 1.6;">
                    <li>Use the shareware version (DOOM1.WAD)</li>
                    <li>Extract from your legally owned copy</li>
                    <li>Create a .jsdos bundle using js-dos tools</li>
                    </ul>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #2c2c2c; border-radius: 5px;">
                    <p style="margin: 0; color: #ffa502;"><strong>Note:</strong> This emulator loads local files only. Make sure the files are accessible from your web server.</p>
                    </div>
                </div>
                </div>
            `;
            }
        }
        };

        initDoom();

        return () => {
        if (dosInstanceRef.current) {
            try {
            if (typeof dosInstanceRef.current.exit === "function") {
                dosInstanceRef.current.exit();
                console.log("DOS instance exited via exit().");
            } else if (typeof dosInstanceRef.current.terminate === "function") {
                dosInstanceRef.current.terminate();
                console.log("DOS instance terminated via terminate().");
            } else if (typeof dosInstanceRef.current.close === "function") {
                dosInstanceRef.current.close();
                console.log("DOS instance closed via close().");
            } else {
                console.log("No cleanup method found, clearing reference.");
            }

            dosInstanceRef.current = null;
            if (dosRef.current) dosRef.current.innerHTML = "";
            } catch (e) {
            console.log("Error during cleanup:", e);
            dosInstanceRef.current = null;
            if (dosRef.current) dosRef.current.innerHTML = "";
            }
        }
        };
    }, []);

    return (
        <div ref={dosRef} className="flex items-center justify-center bg-red-500" />
    );
    }
