# Lenovo Battery Conservation Mode Applet for Linux Mint Cinnamon

This Cinnamon applet allows **Lenovo laptop users** on **Linux Mint** (or any Cinnamon desktop) to easily toggle the **Battery Conservation Mode** feature.

Battery Conservation Mode is a hardware-supported feature found on many Lenovo laptops that helps extend battery lifespan by limiting charging to around 60%.

## 🔧 Features

- Simple switch in the Cinnamon panel to enable/disable battery conservation
- Reads and writes directly to:  
  `/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode`
- Uses `pkexec` for safe privilege escalation when writing the setting
- Persistent state stored in applet settings
- Clean icon and tooltip indicating current status

## 📸 Screenshot
> *(Add screenshot here if desired)*

## 🖥️ Requirements

- Lenovo laptop with support for **conservation_mode**
- Cinnamon desktop environment (e.g. Linux Mint)
- PolicyKit (`pkexec`) installed and configured
- User must have permission to run `pkexec` with echo/write to the system file

## 📦 Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/conservationmode@draganov.git
Copy the folder to your Cinnamon applets directory:
mkdir -p ~/.local/share/cinnamon/applets/
cp -r conservationmode@draganov ~/.local/share/cinnamon/applets/
Restart Cinnamon (Alt+F2, type r, then press Enter) or log out and log in again.
Add the applet to your panel:
Right-click panel → Add Applets to the Panel
Look for Battery Conservation Mode and add it.
🔒 Permissions

Make sure pkexec allows your user to write to the required system file. You may need to create a PolicyKit rule.

Example (⚠️ Use with caution):

sudo nano /etc/polkit-1/rules.d/50-conservationmode.rules
polkit.addRule(function(action, subject) {
    if (action.id == "org.freedesktop.policykit.exec" &&
        subject.isInGroup("your-username")) {
        return polkit.Result.YES;
    }
});
🧪 Tested On

Linux Mint 21.3 Cinnamon
Lenovo Ideapad and ThinkPad laptops
📜 License

MIT
Includes usage of particles.js under the MIT license (if used in the UI or visuals).

🙋 Author

Ivo Draganov
GitHub: @ivodraganov
