import { useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
const useKeyboardShortcuts = (shortcutMap) => {
  const routeTo = useNavigate();
  useEffect(() => {
    const handleKeyPress = (event) => {
      for (const shortcut in shortcutMap) {
        if (event.key === shortcut && event.altKey) {
          const route = shortcutMap[shortcut];
          if (route) {
            routeTo(route);
          }
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [shortcutMap]);
};

const shortcutToRouteMap = {
  s: "/Inventory/S.I",
  p: "/Inventory/P.V",

  // Add more shortcuts and corresponding routes here
};

function ShortCutKeys() {
  useKeyboardShortcuts(shortcutToRouteMap);

  return Object.entries(shortcutToRouteMap);
}

export default ShortCutKeys;
