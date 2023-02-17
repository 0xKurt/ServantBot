import IModifier from "./IModifier";
import pc from "picocolors";
import { CoinData } from "../../types";

class ModifierManager {
  private mods: IModifier[];

  constructor() {
    this.mods = [];
    console.log("\n   ", pc.underline("ModifierManager initialized"));
  }

  registerMod(mod: IModifier) {
    this.mods.push(mod);
    console.log(`     ${pc.green("✓")} Modifier registered: ${mod.name()}`);
  }

  async applyChanges(data: CoinData): Promise<CoinData> {
    let newData = data;
    for (const mod of this.mods) {
      // console.log(`     ${pc.green("✓")} Sending data to bot: ${bot.name()}`, data);
      newData = await mod.applyChanges(newData);
    }
    return newData;
  }
}

export default ModifierManager;
