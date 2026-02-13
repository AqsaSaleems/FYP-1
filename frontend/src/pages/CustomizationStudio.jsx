import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CustomizationStudio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  const [view, setView] = useState("front");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(24);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(100);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [stickerSize, setStickerSize] = useState(80);
  const [designText, setDesignText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [stickerSearch, setStickerSearch] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("");
  const [frontDataUrl, setFrontDataUrl] = useState(null);
  const [backDataUrl, setBackDataUrl] = useState(null);
  const [apiStickers, setApiStickers] = useState([]);
  const [stickerLoading, setStickerLoading] = useState(false);
  const [stickerError, setStickerError] = useState(null);

  // Per-side design states so front/back customizations persist separately
  const [frontDesign, setFrontDesign] = useState({
    designText: "",
    selectedColor: "#FFFFFF",
    fontSize: 24,
    selectedFont: "Arial",
    logo: null,
    logoSize: 100,
    selectedSticker: null,
    stickerSize: 80,
    textPos: { x: 50, y: 50 },
    logoPos: { x: 20, y: 20 },
    stickerPos: { x: 70, y: 70 },
    instructions: "",
  });

  const [backDesign, setBackDesign] = useState({
    designText: "",
    selectedColor: "#FFFFFF",
    fontSize: 24,
    selectedFont: "Arial",
    logo: null,
    logoSize: 100,
    selectedSticker: null,
    stickerSize: 80,
    textPos: { x: 50, y: 50 },
    logoPos: { x: 20, y: 20 },
    stickerPos: { x: 70, y: 70 },
    instructions: "",
  });

  // Positioning states
  const [textPos, setTextPos] = useState({ x: 50, y: 50 });
  const [logoPos, setLogoPos] = useState({ x: 20, y: 20 });
  const [stickerPos, setStickerPos] = useState({ x: 70, y: 70 });
  const [draggingElement, setDraggingElement] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [suppressViewSync, setSuppressViewSync] = useState(false);

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const fabricColors = [

 
  { name: "Black", color: "#000000" },
   { name: "White", color: "#FFFFFF" },
  { name: "Navy", color: "#1E3A8A" },
  { name: "Gray", color: "#6B7280" },
  { name: "Red", color: "#EF4444" },
  { name: "Blue", color: "#3B82F6" },
  { name: "Green", color: "#10B981" },
   { name: "Orange", color: "#F97316" },
  { name: "Yellow", color: "#FACC15" },
  { name: "Turquoise", color: "#40E0D0" },
  { name: "Coral", color: "#FF7F50" },
  { name: "Magenta", color: "#FF00FF" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Cyan", color: "#22D3EE" },
  { name: "Olive", color: "#808000" },
  { name: "Maroon", color: "#800000" },
  { name: "Teal", color: "#008080" },
  { name: "Chocolate", color: "#D2691E" },
  { name: "Gold", color: "#FFD700" },
  { name: "Silver", color: "#C0C0C0" },
  { name: "Sky Blue", color: "#87CEEB" },
  { name: "Turquoise Green", color: "#00CED1" },
  { name: "Beige", color: "#F5E6D3" },
  { name: "Pink", color: "#FFD4D4" },
  { name: "Lavender", color: "#E4C7E8" },
  { name: "Mint", color: "#D4E7E7" },
  { name: "Peach", color: "#FFE5D9" },
  

  // Additional colors
 
];


  // Popular stickers with search keywords - High Quality Flaticon Stickers
  const popularStickers = [
    { id: 1, name: "Location", keywords: "star special celebration", url: "https://cdn-icons-png.flaticon.com/512/1144/1144687.png" },
    { id: 2, name: "Red Heart", keywords: "heart love romantic valentine", url: "https://cdn-icons-png.flaticon.com/512/833/833472.png" },
    { id: 3, name: "Doctor", keywords: "smile happy face emoji", url: "https://cdn-icons-png.flaticon.com/512/2752/2752090.png" },
    { id: 4, name: "Lightning Bolt", keywords: "thunder lightning bolt power energy", url: "https://cdn-icons-png.flaticon.com/512/414/414927.png" },
    { id: 5, name: "Musical Note", keywords: "music note sound audio", url: "https://cdn-icons-png.flaticon.com/512/2922/2922500.png" },
    { id: 6, name: "Way", keywords: "leaf nature green plant tree", url: "https://cdn-icons-png.flaticon.com/512/714/714534.png" },
    { id: 7, name: "Network", keywords: "flower floral bloom garden", url: "https://cdn-icons-png.flaticon.com/512/2540/2540275.png" },
    { id: 8, name: "Mom", keywords: "snowflake winter christmas cold", url: "https://cdn-icons-png.flaticon.com/512/414/414999.png" },
    { id: 9, name: "Tea Cup", keywords: "birthday cake party celebrate", url: "https://cdn-icons-png.flaticon.com/512/924/924514.png" },
    { id: 10, name: "Telescoope", keywords: "balloon birthday party celebration", url: "https://cdn-icons-png.flaticon.com/512/1995/1995567.png" },
    { id: 11, name: "Windy", keywords: "gift present birthday box", url: "https://cdn-icons-png.flaticon.com/512/1762/1762506.png" },
    { id: 12, name: "Dog", keywords: "crown royal king queen anniversary", url: "https://cdn-icons-png.flaticon.com/512/1462/1462133.png" },
    { id: 13, name: "Community", keywords: "sun sunshine bright warm", url: "https://cdn-icons-png.flaticon.com/512/681/681494.png" },
    { id: 14, name: "Profile", keywords: "sparkle shine glitter special", url: "https://cdn-icons-png.flaticon.com/512/747/747376.png" },
    { id: 15, name: "Cloud", keywords: "fire flame hot burn cool", url: "https://cdn-icons-png.flaticon.com/512/414/414927.png" },
    { id: 16, name: "Stethoscope", keywords: "cloud weather sky blue", url: "https://cdn-icons-png.flaticon.com/512/822/822144.png" },
    { id: 17, name: "Innovation", keywords: "rainbow colors spectrum", url: "https://cdn-icons-png.flaticon.com/512/1087/1087840.png" },
    { id: 18, name: "Butterfly", keywords: "butterfly insect nature", url: "https://cdn-icons-png.flaticon.com/512/921/921489.png" },
    { id: 19, name: "Puppy", keywords: "paw pet animal dog cat", url: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { id: 20, name: "Google", keywords: "camera photo vintage picture", url: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png" },
    { id: 21, name: "Partly Sunny", keywords: "anchor nautical sea boat", url: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png" },
    { id: 22, name: "Sea Waves", keywords: "peace sign hippie calm", url: "https://cdn-icons-png.flaticon.com/512/616/616545.png" },
    { id: 23, name: "Thumbs Up", keywords: "like approve good", url: "https://cdn-icons-png.flaticon.com/512/633/633759.png" },
    { id: 24, name: "Message", keywords: "rocket space launch", url: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png" },
  ];

  const fonts = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana", "Impact"];
  const canvasRef = useRef(null);

  // Helper function to validate and use design positions correctly
  const getDesignWithCorrectPositions = () => {
    const currentDesign = view === "front" ? frontDesign : backDesign;
    return {
      designText: designText || currentDesign.designText || "",
      selectedColor: selectedColor || currentDesign.selectedColor || "#FFFFFF",
      fontSize: fontSize || currentDesign.fontSize || 24,
      selectedFont: selectedFont || currentDesign.selectedFont || "Arial",
      logo: logo || currentDesign.logo || null,
      logoSize: logoSize || currentDesign.logoSize || 100,
      selectedSticker: selectedSticker || currentDesign.selectedSticker || null,
      stickerSize: stickerSize || currentDesign.stickerSize || 80,
      textPos: textPos || currentDesign.textPos || { x: 50, y: 50 },
      logoPos: logoPos || currentDesign.logoPos || { x: 20, y: 20 },
      stickerPos: stickerPos || currentDesign.stickerPos || { x: 70, y: 70 },
    };
  };

  // Load design from preview page (back to edit)
  useEffect(() => {
    if (location.state?.item) {
      const cartItem = location.state.item;
      
      // Parse customization details
      const customDetails = typeof cartItem.customization === "string"
        ? JSON.parse(cartItem.customization)
        : cartItem.customization;

      // Load front and back designs if they exist
      if (customDetails?.frontDesign) {
        setFrontDesign(customDetails.frontDesign);
        if (customDetails.frontDesign.designText) setDesignText(customDetails.frontDesign.designText);
        if (customDetails.frontDesign.selectedColor) setSelectedColor(customDetails.frontDesign.selectedColor);
        if (customDetails.frontDesign.selectedFont) setSelectedFont(customDetails.frontDesign.selectedFont);
        if (customDetails.frontDesign.fontSize) setFontSize(customDetails.frontDesign.fontSize);
        if (customDetails.frontDesign.logo) setLogo(customDetails.frontDesign.logo);
        if (customDetails.frontDesign.logoSize) setLogoSize(customDetails.frontDesign.logoSize);
        if (customDetails.frontDesign.selectedSticker) setSelectedSticker(customDetails.frontDesign.selectedSticker);
        if (customDetails.frontDesign.stickerSize) setStickerSize(customDetails.frontDesign.stickerSize);
        if (customDetails.frontDesign.textPos) setTextPos(customDetails.frontDesign.textPos);
        if (customDetails.frontDesign.logoPos) setLogoPos(customDetails.frontDesign.logoPos);
        if (customDetails.frontDesign.stickerPos) setStickerPos(customDetails.frontDesign.stickerPos);
      }

      if (customDetails?.backDesign) {
        setBackDesign(customDetails.backDesign);
      }

      if (customDetails?.instructions) {
        setInstructions(customDetails.instructions);
      }

      // Set initial view to front. suppress view-sync briefly to avoid race overwriting restored UI
      setSuppressViewSync(true);
      setView("front");
      // Wait a bit to ensure restored front/back designs are set, then re-apply UI from the restored data
      setTimeout(() => {
        setSuppressViewSync(false);
        if (customDetails?.frontDesign) {
          const f = customDetails.frontDesign;
          if (f.designText) setDesignText(f.designText);
          if (f.selectedColor) setSelectedColor(f.selectedColor);
          if (f.selectedFont) setSelectedFont(f.selectedFont);
          if (f.fontSize) setFontSize(f.fontSize);
          if (f.logo) setLogo(f.logo);
          if (f.logoSize) setLogoSize(f.logoSize);
          if (f.selectedSticker) setSelectedSticker(f.selectedSticker);
          if (f.stickerSize) setStickerSize(f.stickerSize);
          if (f.textPos) setTextPos(f.textPos);
          if (f.logoPos) setLogoPos(f.logoPos);
          if (f.stickerPos) setStickerPos(f.stickerPos);
        }
      }, 300);
    }
  }, [location.state?.item]);

      // Note: UI syncing on view change handled by the dedicated view-only effect below.

  // Fetch product on mount
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  // Fetch product images as data URLs to avoid CORS issues when capturing
  useEffect(() => {
    if (!product) return;

    const toDataUrl = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn('toDataUrl failed for', url, e.message);
        return null;
      }
    };

    (async () => {
      const f = product.frontImage ? await toDataUrl(product.frontImage) : null;
      const b = product.backImage ? await toDataUrl(product.backImage) : null;
      setFrontDataUrl(f);
      setBackDataUrl(b);
    })();
  }, [product]);

  // Calculate dynamic customization price
  const calculateCustomizationPrice = () => {
    let price = 0;

    if (designText.length > 0) {
      price += 200; // Text customization
    }
    if (logo) {
      price += 300; // Logo upload
    }
    if (selectedSticker) {
      price += 150; // Sticker
    }

    return price;
  };

  // Calculate customization price for a specific design object
  const calculateDesignPrice = (design) => {
    let price = 0;
    if (design.designText && design.designText.length > 0) {
      price += 200; // Text customization
    }
    if (design.logo) {
      price += 300; // Logo upload
    }
    if (design.selectedSticker) {
      price += 150; // Sticker
    }
    return price;
  };

  // Get total front + back charges
  const getTotalCharges = () => {
    const frontPrice = calculateDesignPrice(frontDesign);
    const backPrice = calculateDesignPrice(backDesign);
    return frontPrice + backPrice;
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result); // save as data URL so it persists across pages
      };
      reader.onerror = () => {
        console.warn("Failed to read logo file");
      };
      reader.readAsDataURL(file);
    }
  };

  // Emoji sticker library for fallback
  const emojiStickers = {
    "cap": [{ name: "Baseball Cap", emoji: "🧢" }, { name: "Crown", emoji: "👑" }],
    "cloud": [{ name: "Cloud", emoji: "☁️" }, { name: "Cloudy", emoji: "🌥️" }, { name: "Thundercloud", emoji: "⛈️" }],
    "cake": [{ name: "Birthday Cake", emoji: "🎂" }, { name: "Cupcake", emoji: "🧁" }],
    "star": [{ name: "Star", emoji: "⭐" }, { name: "Sparkles", emoji: "✨" }],
    "love": [{ name: "Red Heart", emoji: "❤️" }, { name: "Heartbreak", emoji: "💔" }, { name: "Pink Heart", emoji: "🩷" }],
    "birthday": [{ name: "Birthday Cake", emoji: "🎂" }, { name: "Party Popper", emoji: "🎉" }, { name: "Balloon", emoji: "🎈" }],
    "fire": [{ name: "Fire", emoji: "🔥" }, { name: "Flame", emoji: "🔥" }],
    "smile": [{ name: "Grinning Face", emoji: "😀" }, { name: "Smiling Face", emoji: "😊" }, { name: "Laughing", emoji: "😂" }],
    "flower": [{ name: "Rose", emoji: "🌹" }, { name: "Sunflower", emoji: "🌻" }, { name: "Tulip", emoji: "🌷" }],
    "music": [{ name: "Musical Note", emoji: "🎵" }, { name: "Music Notes", emoji: "🎶" }, { name: "Headphones", emoji: "🎧" }],
    "cat": [{ name: "Cat Face", emoji: "😸" }, { name: "Cat", emoji: "🐱" }, { name: "Tiger", emoji: "🐯" }],
    "dog": [{ name: "Dog Face", emoji: "🐶" }, { name: "Dog", emoji: "🐕" }],
    "sun": [{ name: "Sunshine", emoji: "☀️" }, { name: "Sunny", emoji: "🌞" }],
    "moon": [{ name: "Crescent Moon", emoji: "🌙" }, { name: "Full Moon", emoji: "🌕" }],
    "snow": [{ name: "Snowflake", emoji: "❄️" }, { name: "Snowman", emoji: "⛄" }],
    "rain": [{ name: "Rain", emoji: "🌧️" }, { name: "Umbrella", emoji: "☔" }],
    "heart": [{ name: "Red Heart", emoji: "❤️" }, { name: "Pink Heart", emoji: "🩷" }, { name: "Blue Heart", emoji: "💙" }],
    "gift": [{ name: "Wrapped Gift", emoji: "🎁" }, { name: "Gift Box", emoji: "🎀" }],
    "butterfly": [{ name: "Butterfly", emoji: "🦋" }],
    "tree": [{ name: "Tree", emoji: "🌲" }, { name: "Palm Tree", emoji: "🌴" }],
    "rainbow": [{ name: "Rainbow", emoji: "🌈" }],
    "heart": [{ name: "Heart", emoji: "❤️" }],
  };

  // Fetch stickers using Pixabay API (more reliable) with emoji fallback
  const fetchStickersFromAPI = async (query) => {
    if (!query.trim()) {
      setApiStickers([]);
      setStickerError(null);
      return;
    }

    setStickerLoading(true);
    setStickerError(null);

    try {
      // Try Pixabay API first (free, no auth required)
      const pixabayUrl = `https://pixabay.com/api/?key=47526681&q=${encodeURIComponent(query)}&image_type=png&pretty=true&per_page=20`;
      const response = await fetch(pixabayUrl);

      if (response.ok) {
        const data = await response.json();
        
        if (data.hits && data.hits.length > 0) {
          // Transform Pixabay response to our sticker format
          const stickers = data.hits.map((result, index) => ({
            id: `pixabay_${index}`,
            name: `${query.charAt(0).toUpperCase() + query.slice(1)} ${index + 1}`,
            keywords: query,
            url: result.pixelURL, // Use smaller thumbnail for faster loading
          }));

          setApiStickers(stickers);
          return;
        }
      }

      // If Pixabay returns no results or fails, use emoji stickers as fallback
      const lowerQuery = query.toLowerCase();
      let emojiResults = [];

      // Find matching emoji stickers
      Object.entries(emojiStickers).forEach(([key, values]) => {
        if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
          emojiResults = emojiResults.concat(values);
        }
      });

      // If still no results, create dynamic emoji-based stickers
      if (emojiResults.length === 0) {
        const commonEmojis = ["🎉", "🌟", "💫", "✨", "🎊", "🎈", "🎁", "💝", "🌈", "🔥"];
        emojiResults = commonEmojis.map((emoji, index) => ({
          name: `${query} ${index + 1}`,
          emoji: emoji,
        }));
      }

      // Convert emoji stickers to canvas-compatible format
      const emojiStickersFormatted = emojiResults.map((sticker, index) => ({
        id: `emoji_${index}`,
        name: sticker.name || `Sticker ${index + 1}`,
        keywords: query,
        url: null,
        emoji: sticker.emoji,
      }));

      setApiStickers(emojiStickersFormatted);
    } catch (error) {
      console.error("Sticker fetch error:", error);
      
      // Final fallback: Use emoji stickers even if API fails
      const lowerQuery = query.toLowerCase();
      let emojiResults = [];

      Object.entries(emojiStickers).forEach(([key, values]) => {
        if (key.includes(lowerQuery) || lowerQuery.includes(key)) {
          emojiResults = emojiResults.concat(values);
        }
      });

      if (emojiResults.length === 0) {
        const commonEmojis = ["🎉", "🌟", "💫", "✨", "🎊"];
        emojiResults = commonEmojis.map((emoji, index) => ({
          name: `Sticker ${index + 1}`,
          emoji: emoji,
        }));
      }

      const fallbackStickers = emojiResults.map((sticker, index) => ({
        id: `emoji_${index}`,
        name: sticker.name,
        keywords: query,
        url: null,
        emoji: sticker.emoji,
      }));

      setApiStickers(fallbackStickers);
    } finally {
      setStickerLoading(false);
    }
  };

  // Debounced search handler
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (stickerSearch.trim()) {
        fetchStickersFromAPI(stickerSearch);
      } else {
        setApiStickers([]);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayTimer);
  }, [stickerSearch]);

  const handleMouseDown = (e) => {
    const element = e.currentTarget.getAttribute("data-element");
    if (!element) return;

    setDraggingElement(element);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (element === "text") {
      setOffset({ x: x - (textPos.x / 100) * rect.width, y: y - (textPos.y / 100) * rect.height });
    } else if (element === "logo") {
      setOffset({ x: x - (logoPos.x / 100) * rect.width, y: y - (logoPos.y / 100) * rect.height });
    } else if (element === "sticker") {
      setOffset({ x: x - (stickerPos.x / 100) * rect.width, y: y - (stickerPos.y / 100) * rect.height });
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;

    const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));

    if (draggingElement === "text") {
      setTextPos({ x: xPercent, y: yPercent });
    } else if (draggingElement === "logo") {
      setLogoPos({ x: xPercent, y: yPercent });
    } else if (draggingElement === "sticker") {
      setStickerPos({ x: xPercent, y: yPercent });
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
  };

  // Sticker size controls
  const handleIncreaseStickerSize = () => {
    setStickerSize(Math.min(stickerSize + 20, 200));
  };

  const handleDecreaseStickerSize = () => {
    setStickerSize(Math.max(stickerSize - 20, 40));
  };

  const handleDeleteSticker = () => {
    setSelectedSticker(null);
    setStickerSize(80);
    setStickerPos({ x: 70, y: 70 });
  };

  // Undo/Redo functions
  const saveToHistory = () => {
    const state = {
      designText,
      selectedColor,
      fontSize,
      selectedFont,
      logo,
      logoSize,
      selectedSticker,
      stickerSize,
      textPos,
      logoPos,
      stickerPos,
    };
    
    // Only save if this state is different from the last saved state
    if (historyIndex >= 0) {
      const lastState = history[historyIndex];
      if (JSON.stringify(lastState) === JSON.stringify(state)) {
        return; // Don't save if it's identical to last state
      }
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setDesignText(previousState.designText);
      setSelectedColor(previousState.selectedColor);
      setFontSize(previousState.fontSize);
      setSelectedFont(previousState.selectedFont);
      setLogo(previousState.logo);
      setLogoSize(previousState.logoSize);
      setSelectedSticker(previousState.selectedSticker);
      setStickerSize(previousState.stickerSize);
      setTextPos(previousState.textPos);
      setLogoPos(previousState.logoPos);
      setStickerPos(previousState.stickerPos);
      // after restoring UI, persist into current side design
      const restored = {
        designText: previousState.designText,
        selectedColor: previousState.selectedColor,
        fontSize: previousState.fontSize,
        selectedFont: previousState.selectedFont,
        logo: previousState.logo,
        logoSize: previousState.logoSize,
        selectedSticker: previousState.selectedSticker,
        stickerSize: previousState.stickerSize,
        textPos: previousState.textPos,
        logoPos: previousState.logoPos,
        stickerPos: previousState.stickerPos,
        instructions,
      };
      if (view === "front") setFrontDesign(restored);
      else setBackDesign(restored);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setDesignText(nextState.designText);
      setSelectedColor(nextState.selectedColor);
      setFontSize(nextState.fontSize);
      setSelectedFont(nextState.selectedFont);
      setLogo(nextState.logo);
      setLogoSize(nextState.logoSize);
      setSelectedSticker(nextState.selectedSticker);
      setStickerSize(nextState.stickerSize);
      setTextPos(nextState.textPos);
      setLogoPos(nextState.logoPos);
      setStickerPos(nextState.stickerPos);
      // persist restored state into current side
      const restored = {
        designText: nextState.designText,
        selectedColor: nextState.selectedColor,
        fontSize: nextState.fontSize,
        selectedFont: nextState.selectedFont,
        logo: nextState.logo,
        logoSize: nextState.logoSize,
        selectedSticker: nextState.selectedSticker,
        stickerSize: nextState.stickerSize,
        textPos: nextState.textPos,
        logoPos: nextState.logoPos,
        stickerPos: nextState.stickerPos,
        instructions,
      };
      if (view === "front") setFrontDesign(restored);
      else setBackDesign(restored);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Logo size controls
  const handleIncreaseLogoSize = () => {
    setLogoSize(Math.min(logoSize + 20, 200));
  };

  const handleDecreaseLogoSize = () => {
    setLogoSize(Math.max(logoSize - 20, 40));
  };

  const handleDeleteLogo = () => {
    setLogo(null);
    setLogoSize(100);
    setLogoPos({ x: 20, y: 20 });
  };

  // Auto-save to history when design changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToHistory();
    }, 1000);
    return () => clearTimeout(timer);
  }, [designText, selectedColor, fontSize, selectedFont, logo, logoSize, selectedSticker, stickerSize, textPos, logoPos, stickerPos]);

  // When switching view, load that side's design into the UI state
  // NOTE: depend only on `view` to avoid re-loading on every internal save
  useEffect(() => {
    if (suppressViewSync) return;
    const current = view === "front" ? frontDesign : backDesign;
    setDesignText(current.designText || "");
    setSelectedColor(current.selectedColor || "#FFFFFF");
    setFontSize(current.fontSize || 24);
    setSelectedFont(current.selectedFont || "Arial");
    setLogo(current.logo || null);
    setLogoSize(current.logoSize || 100);
    setSelectedSticker(current.selectedSticker || null);
    setStickerSize(current.stickerSize || 80);
    setTextPos(current.textPos || { x: 50, y: 50 });
    setLogoPos(current.logoPos || { x: 20, y: 20 });
    setStickerPos(current.stickerPos || { x: 70, y: 70 });
    setInstructions(current.instructions || "");
  }, [view]);

  // Persist UI changes into the current side's design object
  // Skip persisting while we are restoring state from preview/back-to-edit to avoid overwriting
  useEffect(() => {
    if (suppressViewSync) return;

    const snapshot = {
      designText,
      selectedColor,
      fontSize,
      selectedFont,
      logo,
      logoSize,
      selectedSticker,
      stickerSize,
      textPos,
      logoPos,
      stickerPos,
      instructions,
    };
    if (view === "front") {
      setFrontDesign(snapshot);
    } else {
      setBackDesign(snapshot);
    }
  }, [designText, selectedColor, fontSize, selectedFont, logo, logoSize, selectedSticker, stickerSize, textPos, logoPos, stickerPos, instructions, view, suppressViewSync]);

  const handleReset = () => {
    const defaults = {
      designText: "",
      selectedColor: "#FFFFFF",
      fontSize: 24,
      selectedFont: "Arial",
      logo: null,
      logoSize: 100,
      selectedSticker: null,
      stickerSize: 80,
      textPos: { x: 50, y: 50 },
      logoPos: { x: 20, y: 20 },
      stickerPos: { x: 70, y: 70 },
      instructions: "",
    };

    setDesignText(defaults.designText);
    setSelectedColor(defaults.selectedColor);
    setFontSize(defaults.fontSize);
    setSelectedFont(defaults.selectedFont);
    setLogo(defaults.logo);
    setLogoSize(defaults.logoSize);
    setSelectedSticker(defaults.selectedSticker);
    setStickerSize(defaults.stickerSize);
    setInstructions(defaults.instructions);
    setTextPos(defaults.textPos);
    setLogoPos(defaults.logoPos);
    setStickerPos(defaults.stickerPos);
    // reset only the current side's saved design
    if (view === "front") setFrontDesign(defaults);
    else setBackDesign(defaults);
    // clear history globally
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleAddToCart = () => {
    if (!product) {
      alert("Product not found");
      return;
    }

    // Calculate total charges from both front and back designs
    const totalCustomizationPrice = getTotalCharges();

    // Save full design objects so preview and back-to-edit can fully restore state
    const customizationDetails = {
      frontDesign: {
        ...frontDesign,
        charge: calculateDesignPrice(frontDesign),
      },
      backDesign: {
        ...backDesign,
        charge: calculateDesignPrice(backDesign),
      },
      instructions: instructions,
      totalCharge: totalCustomizationPrice,
    };

    const customizationString = JSON.stringify(customizationDetails);

    // If user is not logged in, save pending action and redirect to login/signup
    if (!user) {
      const pending = {
        type: "add",
        payload: {
          product,
          quantity,
          size: selectedSize,
          customization: customizationString,
          customizationPrice: totalCustomizationPrice,
        },
      };
      localStorage.setItem("pendingAction", JSON.stringify(pending));
      alert("Please sign in or sign up to complete adding to cart.");
      navigate("/login");
      return;
    }

    addToCart(product, quantity, selectedSize, customizationString, totalCustomizationPrice);
    alert(`Added to cart with Rs.${totalCustomizationPrice} customization charge!`);
    navigate("/cart");
  };

  const handleDownloadDesign = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Canvas not found!");
      return;
    }

    if (!downloadFormat) {
      alert("Please select a download format (PNG, JPG or PDF).");
      return;
    }

    try {
      // First, persist current UI state to the design object to ensure positions are saved
      const currentDesignSnapshot = {
        designText,
        selectedColor,
        fontSize,
        selectedFont,
        logo,
        logoSize,
        selectedSticker,
        stickerSize,
        textPos,
        logoPos,
        stickerPos,
        instructions,
      };
      
      if (view === "front") {
        setFrontDesign(currentDesignSnapshot);
      } else {
        setBackDesign(currentDesignSnapshot);
      }

      // Log positions for debugging
      console.log("Download started for", view, "view with positions:", {
        textPos,
        logoPos,
        stickerPos,
      });

      // Verify that customization elements exist before proceeding
      if (!designText && !logo && !selectedSticker) {
        alert("Warning: No customizations found. Downloading blank design.");
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `design_${view}_${timestamp}`;

      // Find the image element in the canvas
      const imgElement = canvas.querySelector("img");
      
      if (!imgElement) {
        alert("Product image not found!");
        return;
      }

      // Wait for image to load
      await new Promise((resolve) => {
        if (imgElement.complete) {
          resolve();
        } else {
          imgElement.onload = resolve;
          imgElement.onerror = resolve;
          setTimeout(resolve, 1000);
        }
      });

      // Get the actual image dimensions
      const imgWidth = imgElement.naturalWidth;
      const imgHeight = imgElement.naturalHeight;

      if (!imgWidth || !imgHeight) {
        alert("Could not determine image dimensions!");
        return;
      }

      // Create a temporary container with desired output dimensions.
      // For the BACK view we force 1122x1350 as required; otherwise use the image's natural size.
      let desiredWidth = imgWidth;
      let desiredHeight = imgHeight;
      if (view === "back") {
        desiredWidth = 1122;
        desiredHeight = 1350;
      }

      const rect = canvas.getBoundingClientRect();
      const scaleFactor = rect.width > 0 ? desiredWidth / rect.width : 1;

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.width = `${desiredWidth}px`;
      tempContainer.style.height = `${desiredHeight}px`;
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.overflow = "hidden";
      document.body.appendChild(tempContainer);

      // Clone the canvas and resize to desired output pixels
      const clonedContainer = canvas.cloneNode(true);
      clonedContainer.style.width = `${desiredWidth}px`;
      clonedContainer.style.height = `${desiredHeight}px`;
      clonedContainer.style.position = "relative";
      clonedContainer.style.overflow = "hidden";

      // Ensure product image fills the cloned area
      const clonedImg = clonedContainer.querySelector("img");
      if (clonedImg) {
        clonedImg.style.width = "100%";
        clonedImg.style.height = "100%";
        clonedImg.style.objectFit = "contain";
        clonedImg.style.position = "absolute";
        clonedImg.style.top = "0";
        clonedImg.style.left = "0";
        clonedImg.style.zIndex = "0";
      }

      // Scale element sizes (font, logo, sticker) so they appear the same relative size
      // IMPORTANT: Percentages for left/top will automatically scale with the new container size
      const textEl = clonedContainer.querySelector('[data-element="text"]');
      const logoEl = clonedContainer.querySelector('[data-element="logo"]');
      const stickerEl = clonedContainer.querySelector('[data-element="sticker"]');

      if (textEl) {
        textEl.style.pointerEvents = "none";
        textEl.style.fontSize = `${fontSize * scaleFactor}px`;
        textEl.style.position = "absolute";
        textEl.style.zIndex = "10";
        // Ensure percentage positioning is applied
        textEl.style.left = `${textPos.x}%`;
        textEl.style.top = `${textPos.y}%`;
        textEl.style.transform = "translate(-50%, -50%)";
        // Ensure text is centered
        textEl.style.textAlign = "center";
      }

      if (logoEl) {
        logoEl.style.pointerEvents = "none";
        logoEl.style.width = `${logoSize * scaleFactor}px`;
        logoEl.style.height = `${logoSize * scaleFactor}px`;
        logoEl.style.position = "absolute";
        logoEl.style.zIndex = "10";
        // Ensure percentage positioning is applied
        logoEl.style.left = `${logoPos.x}%`;
        logoEl.style.top = `${logoPos.y}%`;
        logoEl.style.transform = "translate(-50%, -50%)";
        logoEl.style.objectFit = "contain";
      }

      if (stickerEl) {
        stickerEl.style.pointerEvents = "none";
        stickerEl.style.position = "absolute";
        stickerEl.style.zIndex = "10";
        // emoji stickers use fontSize; image stickers use width/height
        stickerEl.style.fontSize = `${stickerSize * scaleFactor}px`;
        stickerEl.style.width = `${stickerSize * scaleFactor}px`;
        stickerEl.style.height = `${stickerSize * scaleFactor}px`;
        // Ensure percentage positioning is applied
        stickerEl.style.left = `${stickerPos.x}%`;
        stickerEl.style.top = `${stickerPos.y}%`;
        stickerEl.style.transform = "translate(-50%, -50%)";
        if (stickerEl.tagName === "IMG") {
          stickerEl.style.objectFit = "contain";
        }
      }

      tempContainer.appendChild(clonedContainer);

      // Capture with exact desired pixel dimensions (use scale: 1 because we already sized DOM)
      const screenshotCanvas = await html2canvas(clonedContainer, {
        backgroundColor: "#f0f0f0",
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: desiredWidth,
        height: desiredHeight,
        imageTimeout: 0,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      console.log("Captured canvas size:", screenshotCanvas.width, "x", screenshotCanvas.height);

      const link = document.createElement("a");

      if (downloadFormat === "png") {
        link.href = screenshotCanvas.toDataURL("image/png");
        link.download = `${filename}.png`;
        link.click();
      } else if (downloadFormat === "jpg") {
        // Create white background for JPG
        const jpgCanvas = document.createElement("canvas");
        jpgCanvas.width = screenshotCanvas.width;
        jpgCanvas.height = screenshotCanvas.height;
        const jpgCtx = jpgCanvas.getContext("2d");
        jpgCtx.fillStyle = "#FFFFFF";
        jpgCtx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
        jpgCtx.drawImage(screenshotCanvas, 0, 0);
        link.href = jpgCanvas.toDataURL("image/jpeg", 0.95);
        link.download = `${filename}.jpg`;
        link.click();
      } else if (downloadFormat === "pdf") {
        // Use standard PDF sizes for better compatibility
        const pdfWidth = 210; // mm (A4 width)
        const pdfHeight = 297; // mm (A4 height)
        let orientation = "portrait";
        let finalWidth = pdfWidth;
        let finalHeight = pdfHeight;

        // Adjust if image is landscape
        if (screenshotCanvas.width > screenshotCanvas.height) {
          orientation = "landscape";
          finalWidth = 297;
          finalHeight = 210;
        }

        const pdf = new jsPDF({
          orientation: orientation,
          unit: "mm",
          format: "a4",
        });

        // Calculate scale to fit image in PDF while maintaining aspect ratio
        const imgAspectRatio = screenshotCanvas.width / screenshotCanvas.height;
        const pdfAspectRatio = finalWidth / finalHeight;
        let pdfImgWidth, pdfImgHeight, pdfX, pdfY;

        if (imgAspectRatio > pdfAspectRatio) {
          // Image is wider, fit by width
          pdfImgWidth = finalWidth - 10;
          pdfImgHeight = pdfImgWidth / imgAspectRatio;
        } else {
          // Image is taller, fit by height
          pdfImgHeight = finalHeight - 10;
          pdfImgWidth = pdfImgHeight * imgAspectRatio;
        }

        pdfX = (finalWidth - pdfImgWidth) / 2;
        pdfY = (finalHeight - pdfImgHeight) / 2;

        pdf.addImage(screenshotCanvas.toDataURL("image/png"), "PNG", pdfX, pdfY, pdfImgWidth, pdfImgHeight);
        pdf.save(`${filename}.pdf`);
      }

      alert(`✅ Complete design with ${view.toUpperCase()} product + customizations downloaded as ${downloadFormat.toUpperCase()}!`);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download. Please try again.");
    }
  };

  const filteredStickers = popularStickers.filter((sticker) => {
    const searchTerm = stickerSearch.toLowerCase();
    return (
      sticker.name.toLowerCase().includes(searchTerm) ||
      sticker.keywords.toLowerCase().includes(searchTerm)
    );
  });

  if (!product) {
    return <h2 style={{ textAlign: "center", padding: "50px" }}>Loading customization studio...</h2>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <button style={styles.backBtn} onClick={() => navigate(`/product/${id}`)}>
          ← Back
        </button>
        <div style={styles.productInfo}>
          {(frontDataUrl || product?.frontImage || product?.image) && (
            <img
              src={frontDataUrl || product.frontImage || product.image}
              alt={product.name}
              style={styles.productImage}
            />
          )}
          <div>
            <h2 style={styles.productName}>{product?.name}</h2>
            <p style={styles.productPrice}>Rs.{product?.price}</p>
          </div>
        </div>
        <div style={styles.undoRedoButtons}>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            style={{...styles.undoBtn, opacity: historyIndex <= 0 ? 0.5 : 1, cursor: historyIndex <= 0 ? "not-allowed" : "pointer"}}
          >
            ↶ Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            style={{...styles.redoBtn, opacity: historyIndex >= history.length - 1 ? 0.5 : 1, cursor: historyIndex >= history.length - 1 ? "not-allowed" : "pointer"}}
          >
            ↷ Redo
          </button>
          <button
            onClick={handleReset}
            style={{...styles.resetBtn}}
          >
            ⟲ Reset
          </button>
        </div>
      </div>

      <div style={styles.mainGrid}>
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <h3 style={styles.panelTitle}>Customize Your Design</h3>

          {/* Fabric Colors */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Text Color</h4>
            <div style={styles.colorGrid}>
              {fabricColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.color)}
                  style={{
                    ...styles.colorButton,
                    backgroundColor: c.color,
                    border: selectedColor === c.color ? "3px solid #000" : "1px solid #ddd",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Text Editor */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Add Text</h4>
            <input
              type="text"
              value={designText}
              onChange={(e) => setDesignText(e.target.value)}
              placeholder="Enter text"
              style={styles.input}
            />
            <label style={styles.label}>Font</label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              style={styles.select}
            >
              {fonts.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <label style={styles.label}>Font Size: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Logo Upload */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Upload Logo</h4>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={styles.input} />
            {logo && (
              <div>
                <p style={styles.uploadedText}>✓ Logo uploaded (Size: {logoSize}px)</p>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={handleIncreaseLogoSize}
                    style={{...styles.sizeBtn, backgroundColor: "#000", color: "#fff"}}
                  >
                    + Increase
                  </button>
                  <button
                    onClick={handleDecreaseLogoSize}
                    style={{...styles.sizeBtn, backgroundColor: "#000", color: "#fff"}}
                  >
                    − Decrease
                  </button>
                  <button
                    onClick={handleDeleteLogo}
                    style={{...styles.sizeBtn, backgroundColor: "#ff6b6b", color: "#fff"}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticker Gallery */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>🎨 Find Stickers</h4>
            <div style={styles.searchContainer}>
              <input
                type="text"
                value={stickerSearch}
                onChange={(e) => setStickerSearch(e.target.value)}
                placeholder="Search: birthday, love, fire, star..."
                style={{...styles.input, fontSize: "14px"}}
              />
              {stickerLoading && <div style={styles.loadingSpinner}>⏳ Loading...</div>}
            </div>

            {/* API Stickers Results */}
            {apiStickers.length > 0 ? (
              <div>
                <h5 style={{margin: "10px 0 5px 0", fontSize: "12px", color: "#666"}}>Dynamic Results ({apiStickers.length})</h5>
                <div style={styles.stickerGrid}>
                  {apiStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => setSelectedSticker(sticker)}
                      style={{
                        ...styles.stickerOption,
                        border: selectedSticker?.id === sticker.id ? "3px solid #ff6b6b" : "1px solid #ddd",
                        backgroundColor: selectedSticker?.id === sticker.id ? "#ffe0e0" : "#fff",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      title={sticker.name}
                    >
                      {sticker.emoji ? (
                        <span style={{ fontSize: "40px" }}>{sticker.emoji}</span>
                      ) : (
                        <img src={sticker.url} alt={sticker.name} style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                      )}
                      <span style={{ fontSize: "10px", marginTop: "5px", textAlign: "center" }}>{sticker.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : stickerSearch.trim() ? (
              <div style={{textAlign: "center", padding: "20px", color: "#999"}}>
                {stickerLoading ? (
                  <p>⏳ Loading stickers...</p>
                ) : (
                  <p>✨ Showing emoji stickers for "{stickerSearch}"</p>
                )}
              </div>
            ) : (
              <div>
                <h5 style={{margin: "10px 0 5px 0", fontSize: "12px", color: "#666"}}>Popular (Offline)</h5>
                <div style={styles.stickerGrid}>
                  {popularStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => setSelectedSticker(sticker)}
                      style={{
                        ...styles.stickerOption,
                        border: selectedSticker?.id === sticker.id ? "3px solid #ff6b6b" : "1px solid #ddd",
                        backgroundColor: selectedSticker?.id === sticker.id ? "#ffe0e0" : "#fff",
                        transition: "transform 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                      title={sticker.name}
                    >
                      <img src={sticker.url} alt={sticker.name} style={{ width: "50px", height: "50px" }} />
                      <span style={{ fontSize: "10px", marginTop: "5px" }}>{sticker.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSticker && (
              <div>
                <p style={styles.selectedText}>✓ {selectedSticker.name} selected (Size: {stickerSize}px)</p>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={handleIncreaseStickerSize}
                    style={{...styles.sizeBtn, backgroundColor: "#000", color: "#fff"}}
                  >
                    + Increase
                  </button>
                  <button
                    onClick={handleDecreaseStickerSize}
                    style={{...styles.sizeBtn, backgroundColor: "#000", color: "#fff"}}
                  >
                    − Decrease
                  </button>
                  <button
                    onClick={handleDeleteSticker}
                    style={{...styles.sizeBtn, backgroundColor: "#ff6b6b", color: "#fff"}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER CANVAS */}
        <div style={styles.centerPanel}>
          <h2 style={styles.centerTitle}>Design Preview</h2>

          {/* View Selector */}
          <div style={styles.viewSelector}>
            <button
              onClick={() => setView("front")}
              style={{
                ...styles.viewBtn,
                backgroundColor: view === "front" ? "#000" : "#fff",
                color: view === "front" ? "#fff" : "#000",
              }}
            >
              Front View
            </button>
            <button
              onClick={() => setView("back")}
              style={{
                ...styles.viewBtn,
                backgroundColor: view === "back" ? "#000" : "#fff",
                color: view === "back" ? "#fff" : "#000",
              }}
            >
              Back View
            </button>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            style={{
              ...styles.canvas,
              position: "relative",
              backgroundColor: "#f0f0f0",
              overflow: "hidden",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Product Image Background */}
            {(view === "front" ? product?.frontImage : product?.backImage) && (
              <img
                src={view === "front" ? product?.frontImage : product?.backImage}
                alt="product"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}

            {/* Design Text */}
            {designText && (
              <div
                onMouseDown={handleMouseDown}
                data-element="text"
                style={{
                  position: "absolute",
                  left: `${textPos.x}%`,
                  top: `${textPos.y}%`,
                  fontSize: `${fontSize}px`,
                  fontFamily: selectedFont,
                  fontWeight: "bold",
                  color: selectedColor,
                  textAlign: "center",
                  maxWidth: "250px",
                  wordWrap: "break-word",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  cursor: draggingElement === "text" ? "grabbing" : "grab",
                  transform: "translate(-50%, -50%)",
                  padding: "5px 10px",
                  userSelect: "none",
                  zIndex: draggingElement === "text" ? 1000 : 10,
                }}
              >
                {designText}
              </div>
            )}

            {/* Logo */}
            {logo && (
              <img
                src={logo}
                alt="logo"
                onMouseDown={handleMouseDown}
                data-element="logo"
                style={{
                  position: "absolute",
                  left: `${logoPos.x}%`,
                  top: `${logoPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                  objectFit: "contain",
                  cursor: draggingElement === "logo" ? "grabbing" : "grab",
                  border: draggingElement === "logo" ? "2px solid #ff6b6b" : "none",
                  userSelect: "none",
                  zIndex: draggingElement === "logo" ? 1000 : 10,
                }}
              />
            )}

            {/* Sticker */}
            {selectedSticker && (
              selectedSticker.emoji ? (
                <div
                  onMouseDown={handleMouseDown}
                  data-element="sticker"
                  style={{
                    position: "absolute",
                    left: `${stickerPos.x}%`,
                    top: `${stickerPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: `${stickerSize}px`,
                    cursor: draggingElement === "sticker" ? "grabbing" : "grab",
                    userSelect: "none",
                    zIndex: draggingElement === "sticker" ? 1000 : 10,
                  }}
                >
                  {selectedSticker.emoji}
                </div>
              ) : (
                <img
                  src={selectedSticker.url}
                  alt="sticker"
                  onMouseDown={handleMouseDown}
                  data-element="sticker"
                  style={{
                    position: "absolute",
                    left: `${stickerPos.x}%`,
                    top: `${stickerPos.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: `${stickerSize}px`,
                    height: `${stickerSize}px`,
                    objectFit: "contain",
                    cursor: draggingElement === "sticker" ? "grabbing" : "grab",
                    border: draggingElement === "sticker" ? "2px solid #ff6b6b" : "none",
                    userSelect: "none",
                    zIndex: draggingElement === "sticker" ? 1000 : 10,
                  }}
                />
              )
            )}
          </div>

          {/* Download Design - Below Canvas */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>💾 Save Design</h4>
            <label style={styles.label}>Download Format</label>
         <select
  value={downloadFormat}
  onChange={(e) => setDownloadFormat(e.target.value)}
  style={styles.select}
>
  <option value="" disabled>
    Select downloading format
  </option>

  <option value="png">PNG</option>
  <option value="jpg">JPG</option>
  <option value="pdf">PDF</option>
</select>

            <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
              Current view: <strong>{view.toUpperCase()}</strong>
            </p>
            <button onClick={handleDownloadDesign} style={styles.downloadBtn}>
              ⬇️ Download Design
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.rightPanel}>
          <h3 style={styles.panelTitle}>Order Details</h3>

          {/* Customization Price Breakdown */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Customization Charges</h4>
            <div style={styles.priceBreakdown}>
              {designText.length > 0 && (
                <div style={styles.priceRow}>
                  <span>📝 Text Design</span>
                  <span>Rs.200</span>
                </div>
              )}
              {logo && (
                <div style={styles.priceRow}>
                  <span>🏷️ Logo Upload</span>
                  <span>Rs.300</span>
                </div>
              )}
              {selectedSticker && (
                <div style={styles.priceRow}>
                  <span>✨ Sticker</span>
                  <span>Rs.150</span>
                </div>
              )}
              {calculateCustomizationPrice() === 0 && (
                <div style={styles.priceRow}>
                  <span>No customization yet</span>
                  <span>Rs.0</span>
                </div>
              )}
              <div style={styles.priceDivider}></div>
              <div style={styles.totalCustomPrice}>
                <span>{view === "front" ? "Front" : "Back"} Side</span>
                <span>Rs.{calculateCustomizationPrice()}</span>
              </div>
            </div>
          </div>

          {/* Total Customization Charges (Front + Back) */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>💰 Total Customization (Front + Back)</h4>
            <div style={styles.priceBreakdown}>
              <div style={styles.priceRow}>
                <span>Front Side Charges</span>
                <span>Rs.{calculateDesignPrice(frontDesign)}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Back Side Charges</span>
                <span>Rs.{calculateDesignPrice(backDesign)}</span>
              </div>
              <div style={styles.priceDivider}></div>
              <div style={{...styles.totalCustomPrice, backgroundColor: "#fff3cd", padding: "12px", borderRadius: "5px"}}>
                <span style={{fontWeight: "bold", fontSize: "16px"}}>Total Charges</span>
                <span style={{fontWeight: "bold", fontSize: "18px", color: "#ff6b6b"}}>Rs.{getTotalCharges()}</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Select Size</h4>
            <div style={styles.buttonGroup}>
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    ...styles.sizeBtn,
                    backgroundColor: selectedSize === size ? "#000" : "#fff",
                    color: selectedSize === size ? "#fff" : "#000",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Quantity</h4>
            <div style={styles.quantityControl}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={styles.quantityBtn}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={styles.quantityInput}
              />
              <button onClick={() => setQuantity(quantity + 1)} style={styles.quantityBtn}>
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Special Instructions</h4>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special requests?"
              style={styles.textarea}
            />
          </div>

          {/* Action Buttons */}
          <button onClick={handleAddToCart} style={styles.addToCartBtn}>
            🛒 Add to Cart
          </button>
          <button onClick={() => navigate("/products")} style={styles.continuShoppingBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  backBtn: {
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "14px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    alignItems: "start",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  centerPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  rightPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  panelTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#000",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
  },
  colorButton: {
    width: "100%",
    height: "40px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "5px",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  slider: {
    width: "100%",
    cursor: "pointer",
  },
  uploadedText: {
    fontSize: "12px",
    color: "#4CAF50",
    fontWeight: "bold",
    margin: "10px 0",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
  },
  materialBtn: {
    padding: "10px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  centerTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  viewSelector: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  viewBtn: {
    padding: "10px 20px",
    border: "2px solid #000",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  canvas: {
    width: "100%",
    height: "500px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sizeBtn: {
    padding: "10px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  quantityControl: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  quantityBtn: {
    padding: "8px 12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  quantityInput: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "14px",
  },
  priceBreakdown: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#333",
  },
  priceDivider: {
    height: "1px",
    backgroundColor: "#ddd",
    margin: "5px 0",
  },
  totalCustomPrice: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000",
    paddingTop: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "12px",
    minHeight: "80px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },
  resetBtn: {
    padding: "12px",
    backgroundColor: "#fff",
    color: "#000",
    border: "2px solid #000",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  downloadBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#FF6B6B",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "all 0.2s",
  },
  addToCartBtn: {
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  continuShoppingBtn: {
    padding: "12px",
    backgroundColor: "#f0f0f0",
    color: "#000",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  stickerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "10px",
  },
  stickerOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "all 0.2s",
  },
  selectedText: {
    fontSize: "12px",
    color: "#4CAF50",
    fontWeight: "bold",
    margin: "10px 0",
  },
  headerSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flex: 1,
  },
  productImage: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  productName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000",
    margin: "0 0 5px 0",
  },
  productPrice: {
    fontSize: "14px",
    color: "#ff6b6b",
    fontWeight: "bold",
    margin: "0",
  },
  undoRedoButtons: {
    display: "flex",
    gap: "10px",
  },
  undoBtn: {
    padding: "10px 15px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  redoBtn: {
    padding: "10px 15px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  resetBtn: {
    padding: "10px 15px",
    backgroundColor: "#ff6b6b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  searchContainer: {
    position: "relative",
    marginBottom: "10px",
  },
  loadingSpinner: {
    textAlign: "center",
    padding: "10px",
    color: "#666",
    fontSize: "12px",
    fontWeight: "bold",
  },
};
