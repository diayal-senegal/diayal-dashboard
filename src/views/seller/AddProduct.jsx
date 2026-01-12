import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector(state => state.category);
  const { loader, successMessage, errorMessage } = useSelector(state => state.product);

  const [state, setState] = useState({
    name: "",
    description: '',
    discount: '',
    price: "",
    brand: "",
    stock: ""
  });

  const inputHandle = (e) => {
    setState(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const [step, setStep] = useState(1);
  const [touchedGenerate, setTouchedGenerate] = useState(false);
  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState('');
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isUniqueItem, setIsUniqueItem] = useState(false);
  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);

  useEffect(() => {
    dispatch(get_category({ searchValue: '', parPage: '', page: "" }));
  }, [dispatch]);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  useEffect(() => {
    if (isUniqueItem) {
      setState(prev => ({ ...prev, stock: '1' }));
    }
  }, [isUniqueItem]);

  const materialsOptions = useMemo(() => ([
    "Cuir", "Wax", "Raphia", "Bois", "Argent", "Or", "Bronze", "Laiton",
    "Perles", "Coton", "Lin", "Soie", "Céramique", "Verre", "Pierre", "Coquillage",
    "Bambou", "Métal", "Tissu", "Laine"
  ]), []);

  const techniqueOptions = useMemo(() => ([
    "Couture", "Tressage", "Broderie", "Gravure", "Sculpture", "Tournage",
    "Martelage", "Assemblage", "Teinture", "Tissage", "Modelage", "Polissage"
  ]), []);

  const usageOptions = useMemo(() => ([
    "Mode", "Bijou", "Déco", "Maison", "Cadeau", "Traditionnel", "Moderne", "Accessoire"
  ]), []);

  const leadTimeOptions = useMemo(() => ([
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "72h", label: "72h" },
    { value: "sur-commande", label: "Sur commande" },
  ]), []);

  const careOptions = useMemo(() => ([
    { value: "default", label: "Conseil standard (recommandé)" },
    { value: "custom", label: "Je veux écrire mes propres conseils" },
    { value: "none", label: "Ne pas afficher d'entretien" }
  ]), []);

  const [artisanSheet, setArtisanSheet] = useState({
    originCity: "",
    originRegion: "",
    materials: [],
    technique: "",
    usage: [],
    size: "",
    colors: "",
    handmadeSN: true,
    variations: true,
    giftWrap: false,
    leadTime: "72h",
    careMode: "default",
    careCustom: ""
  });

  const toggleFromArray = (arr, value) => {
    if (arr.includes(value)) return arr.filter(v => v !== value);
    return [...arr, value];
  };

  const setSheet = (key, value) => {
    setArtisanSheet(prev => ({ ...prev, [key]: value }));
  };

  // Sauvegarde brouillon
  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = {
        state,
        artisanSheet,
        category,
        isUniqueItem,
        step,
        touchedGenerate,
        timestamp: Date.now()
      };
      localStorage.setItem('productDraft', JSON.stringify(draft));
    }, 2000);
    return () => clearTimeout(timer);
  }, [state, artisanSheet, category, isUniqueItem, step, touchedGenerate]);

  // Restauration brouillon
  useEffect(() => {
    const draft = localStorage.getItem('productDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < 24 * 60 * 60 * 1000) {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <span>Brouillon trouvé ! Voulez-vous le restaurer ?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setState(parsed.state || state);
                    setArtisanSheet(parsed.artisanSheet || artisanSheet);
                    setCategory(parsed.category || '');
                    setIsUniqueItem(parsed.isUniqueItem || false);
                    setStep(parsed.step || 1);
                    setTouchedGenerate(parsed.touchedGenerate || false);
                    toast.dismiss(t.id);
                    toast.success('Brouillon restauré !');
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Oui
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('productDraft');
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Non
                </button>
              </div>
            </div>
          ), { duration: 10000 });
        }
      } catch (e) {
        console.error('Erreur restauration brouillon:', e);
      }
    }
  }, []);

  const generateDescription = () => {
    setTouchedGenerate(true);
    const lines = [];

    if (artisanSheet.handmadeSN) {
      lines.push("✅ Fabriqué à la main au Sénégal par un artisan local.");
    }

    if (artisanSheet.originCity || artisanSheet.originRegion) {
      const loc = [artisanSheet.originCity, artisanSheet.originRegion].filter(Boolean).join(", ");
      lines.push(`📍 Origine : ${loc}.`);
    }

    if (artisanSheet.materials?.length) {
      lines.push(`🧵 Matériaux : ${artisanSheet.materials.join(", ")}.`);
    }

    if (artisanSheet.technique) {
      lines.push(`🛠️ Technique : ${artisanSheet.technique}.`);
    }

    if (artisanSheet.colors?.trim()) {
      lines.push(`🎨 Couleur(s) : ${artisanSheet.colors.trim()}.`);
    }

    if (artisanSheet.size?.trim()) {
      lines.push(`📏 Dimensions / Taille : ${artisanSheet.size.trim()}.`);
    }

    if (artisanSheet.usage?.length) {
      lines.push(`🎯 Usage : ${artisanSheet.usage.join(", ")}.`);
    }

    if (isUniqueItem) {
      lines.push("✨ Pièce unique : vous recevrez exactement l'article présenté.");
    } else if (artisanSheet.variations) {
      lines.push("✨ Article artisanal : de légères variations peuvent exister (forme/couleur), c'est normal et fait partie du charme.");
    }

    if (artisanSheet.careMode === "default") {
      lines.push("🧼 Entretien : nettoyer avec un chiffon doux, éviter le lavage agréssif à plus de 30°.");
    } else if (artisanSheet.careMode === "custom" && artisanSheet.careCustom.trim()) {
      lines.push(`🧼 Entretien : ${artisanSheet.careCustom.trim()}`);
    }

    const lead = artisanSheet.leadTime === "sur-commande" ? "sur commande (délais à confirmer)" : artisanSheet.leadTime;
    lines.push(`🚚 Préparation : ${lead}.`);

    if (artisanSheet.giftWrap) {
      lines.push("🎁 Option : emballage cadeau disponible.");
    }

    setState(prev => ({ ...prev, description: lines.join("\n") }));
  };

  const descriptionLength = (state.description || "").length;
  const quality = useMemo(() => {
    let score = 0;

    if (images.length >= 1) score += 10;
    if (images.length >= 3) score += 15;
    if (images.length >= 5) score += 10;
    if (state.name.trim().length >= 3) score += 10;
    if (category) score += 10;
    if (artisanSheet.materials.length) score += 10;
    if (artisanSheet.technique) score += 10;
    if (artisanSheet.size.trim()) score += 10;
    if (artisanSheet.usage.length) score += 10;
    if (descriptionLength >= 120) score += 10;
    if (descriptionLength >= 250) score += 5;
    if (String(state.price).trim()) score += 10;

    if (score > 100) score = 100;

    const tips = [];
    if (images.length < 3) tips.push("Ajoute au moins 3 photos.");
    if (!artisanSheet.materials.length) tips.push("Renseigne les matériaux.");
    if (!artisanSheet.technique) tips.push("Choisis une technique.");
    if (!artisanSheet.size.trim()) tips.push("Ajoute les dimensions / taille.");
    if (!artisanSheet.usage.length) tips.push("Sélectionne l'usage.");
    if (descriptionLength < 120) tips.push("Génère/étoffe la description.");
    if (!state.price) tips.push("Ajoute un prix.");

    return { score, tips };
  }, [images.length, state.name, state.price, category, artisanSheet.materials, artisanSheet.technique, artisanSheet.size, artisanSheet.usage, descriptionLength]);

  const canGoStep2 = () => {
    const okName = state.name.trim().length >= 3;
    const okCat = !!category;
    const okDesc = (state.description || "").trim().length >= 60;
    return okName && okCat && okDesc;
  };

  const goNext = () => {
    if (!canGoStep2()) {
      toast.error("Complète l'étape 1 : Nom + Catégorie + Description (générée ou écrite).");
      return;
    }
    setStep(2);
    setCateShow(false);
  };

  const goBack = () => {
    setStep(1);
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const srcValue = allCategory.filter(c =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;

    if (length > 0) {
      setImages(prev => [...prev, ...files]);

      let urls = [];
      for (let i = 0; i < length; i++) {
        urls.push({ url: URL.createObjectURL(files[i]) });
      }
      setImageShow(prev => [...prev, ...urls]);
    }
  };

  const changeImage = (img, index) => {
    if (!img) return;

    const tempUrl = [...imageShow];
    const tempImages = [...images];

    tempImages[index] = img;
    tempUrl[index] = { url: URL.createObjectURL(img) };

    setImageShow(tempUrl);
    setImages(tempImages);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, index) => index !== i));
    setImageShow(prev => prev.filter((_, index) => index !== i));
  };

  const add = (e) => {
    e.preventDefault();

    if (!state.price) return toast.error("Ajoute un prix.");
    if (!state.stock && !isUniqueItem) return toast.error("Ajoute un stock (ou coche pièce unique).");
    if (!images.length) return toast.error("Ajoute au moins une image.");

    const formData = new FormData();
    formData.append('name', state.name);
    formData.append('description', state.description);
    formData.append('price', state.price);
    formData.append('stock', state.stock);
    formData.append('discount', state.discount);
    formData.append('brand', state.brand);
    formData.append('shopName', '');
    formData.append('category', category);
    formData.append('isUniqueItem', isUniqueItem);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    dispatch(add_product(formData));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());

      setState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
      });

      setCategory('');
      setSearchValue('');
      setCateShow(false);
      setAllCategory(categorys);
      setIsUniqueItem(false);
      setImages([]);
      setImageShow([]);
      setTouchedGenerate(false);
      setStep(1);

      setArtisanSheet({
        originCity: "",
        originRegion: "",
        materials: [],
        technique: "",
        usage: [],
        size: "",
        colors: "",
        handmadeSN: true,
        variations: true,
        giftWrap: false,
        leadTime: "72h",
        careMode: "default",
        careCustom: ""
      });

      localStorage.removeItem('productDraft');
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, categorys]);

  const StepPill = ({ n, title, active }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${active ? 'border-amber-400' : 'border-slate-700'} bg-[#6a5fdf]`}>
      <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-amber-500 text-white' : 'bg-slate-700 text-[#d0d2d6]'}`}>
        {n}
      </span>
      <span className={`text-sm ${active ? 'text-white' : 'text-[#d0d2d6]'}`}>{title}</span>
    </div>
  );

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
        <div className='flex flex-col md:flex-row md:justify-between md:items-center pb-4 gap-3'>
          <div>
            <h1 className='text-[#d0d2d6] text-xl font-semibold'>Ajouter un article</h1>
            <p className="text-[#d0d2d6]/70 text-sm mt-1">
             Création en 2 étapes : remplis la fiche, ajoute les images, puis publie.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to='/seller/dashboard/products'
              className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-5 py-2'
            >
              Tous les articles
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <StepPill n={1} title="Fiche artisanale" active={step === 1} />
          <StepPill n={2} title="Prix & images" active={step === 2} />
        </div>

        <div className="mb-4 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[#d0d2d6] font-semibold">Qualité de la fiche</h2>
              <p className="text-[#d0d2d6]/70 text-sm">
                Score : <span className="text-white font-bold">{quality.score}%</span>
                {quality.score < 70 ? " — on peut faire mieux." : " — propre 👌"}
              </p>
            </div>

            <div className="min-w-[180px] w-full max-w-[280px]">
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${quality.score}%` }}
                />
              </div>
              {quality.tips.length > 0 && (
                <p className="text-xs text-[#d0d2d6]/70 mt-2">
                  Prochaine amélioration : {quality.tips[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={add}>
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                  <div className='flex flex-col w-full gap-1'>
                    <label htmlFor="name">Nom de l'article</label>
                    <input
                      className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                      onChange={inputHandle}
                      value={state.name}
                      type="text"
                      name='name'
                      id='name'
                      placeholder="Ex: Sac en raphia tressé"
                    />
                  </div>

                  <div className='flex flex-col w-full gap-1'>
                    <label htmlFor="brand">Atelier / Artisan (optionnel)</label>
                    <input
                      className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                      onChange={inputHandle}
                      value={state.brand}
                      type="text"
                      name='brand'
                      id='brand'
                      placeholder="Ex: Atelier Ndiaye"
                    />
                  </div>
                </div>

                <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                  <div className='flex flex-col w-full gap-1 relative'>
                    <label htmlFor="category">Categorie</label>
                    <input
                      readOnly
                      onClick={() => setCateShow(!cateShow)}
                      className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                      value={category}
                      type="text"
                      id='category'
                      placeholder='-- sélectionner catégorie --'
                    />

                    <div className={`absolute top-[101%] left-0 bg-[#475569] w-full transition-all origin-top ${cateShow ? 'scale-100' : 'scale-0'} z-50 rounded-md border border-slate-600`}>
                      <div className='w-full px-3 py-2'>
                        <input
                          value={searchValue}
                          onChange={categorySearch}
                          className='px-3 py-2 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6]'
                          type="text"
                          placeholder='Rechercher'
                        />
                      </div>

                      <div className='flex justify-start items-start flex-col max-h-[220px] overflow-y-auto'>
                        {allCategory.map((c, i) => (
                          <span
                            key={i}
                            className={`px-4 py-2 hover:bg-indigo-500 hover:text-white w-full cursor-pointer ${category === c.name ? 'bg-indigo-500 text-white' : ''}`}
                            onClick={() => {
                              setCateShow(false);
                              setCategory(c.name);
                              setSearchValue('');
                              setAllCategory(categorys);
                            }}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col w-full gap-1'>
                    <label>Origine (optionnel)</label>
                    <div className="flex gap-2">
                      <input
                        className='w-full px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.originCity}
                        onChange={(e) => setSheet("originCity", e.target.value)}
                        placeholder="Ville (ex: Dakar)"
                        type="text"
                      />
                      <input
                        className='w-full px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.originRegion}
                        onChange={(e) => setSheet("originRegion", e.target.value)}
                        placeholder="Région (ex: Dakar)"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
                  <h2 className="text-[#d0d2d6] font-semibold mb-2">Détails artisanaux</h2>

                  <div className="mb-3">
                    <p className="text-[#d0d2d6] text-sm mb-2">Matériaux (choisis 1 à 3)</p>
                    <div className="flex flex-wrap gap-2">
                      {materialsOptions.map((m) => {
                        const active = artisanSheet.materials.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSheet("materials", toggleFromArray(artisanSheet.materials, m))}
                            className={`text-xs px-3 py-1 rounded-full border ${
                              active ? 'border-amber-400 bg-amber-500 text-white' : 'border-slate-700 text-[#d0d2d6] hover:bg-slate-700/30'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Technique</label>
                      <select
                        className='px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.technique}
                        onChange={(e) => setSheet("technique", e.target.value)}
                      >
                        <option value="">-- sélectionner --</option>
                        {techniqueOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Usage</label>
                      <div className="flex flex-wrap gap-2">
                        {usageOptions.map((u) => {
                          const active = artisanSheet.usage.includes(u);
                          return (
                            <button
                              key={u}
                              type="button"
                              onClick={() => setSheet("usage", toggleFromArray(artisanSheet.usage, u))}
                              className={`text-xs px-3 py-1 rounded-full border ${
                                active ? 'border-amber-400 bg-amber-500 text-white' : 'border-slate-700 text-[#d0d2d6] hover:bg-slate-700/30'
                              }`}
                            >
                              {u}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Dimensions / Taille</label>
                      <input
                        className='px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.size}
                        onChange={(e) => setSheet("size", e.target.value)}
                        placeholder="Ex: 20cm x 10cm / Taille 42"
                        type="text"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Couleur(s) (optionnel)</label>
                      <input
                        className='px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.colors}
                        onChange={(e) => setSheet("colors", e.target.value)}
                        placeholder="Ex: Noir, Doré"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
                  <h2 className="text-[#d0d2d6] font-semibold mb-2">Options & logistique</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-[#d0d2d6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={artisanSheet.handmadeSN}
                        onChange={(e) => setSheet("handmadeSN", e.target.checked)}
                        className='w-4 h-4 cursor-pointer accent-amber-500'
                      />
                      Fait main au Sénégal
                    </label>

                    <label className="flex items-center gap-2 text-[#d0d2d6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={artisanSheet.variations}
                        onChange={(e) => setSheet("variations", e.target.checked)}
                        className='w-4 h-4 cursor-pointer accent-amber-500'
                      />
                      Variations artisanales possibles
                    </label>

                    <label className="flex items-center gap-2 text-[#d0d2d6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={artisanSheet.giftWrap}
                        onChange={(e) => setSheet("giftWrap", e.target.checked)}
                        className='w-4 h-4 cursor-pointer accent-amber-500'
                      />
                      Emballage cadeau
                    </label>

                    <label className="flex items-center gap-2 text-[#d0d2d6] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isUniqueItem}
                        onChange={(e) => setIsUniqueItem(e.target.checked)}
                        className='w-4 h-4 cursor-pointer accent-amber-500'
                      />
                      Pièce unique (stock = 1)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Préparation</label>
                      <select
                        className='px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.leadTime}
                        onChange={(e) => setSheet("leadTime", e.target.value)}
                      >
                        {leadTimeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[#d0d2d6] text-sm">Entretien</label>
                      <select
                        className='px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        value={artisanSheet.careMode}
                        onChange={(e) => setSheet("careMode", e.target.value)}
                      >
                        {careOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {artisanSheet.careMode === "custom" && (
                    <div className="mt-3">
                      <label className="text-[#d0d2d6] text-sm">Conseils d'entretien (personnalisé)</label>
                      <textarea
                        className='mt-1 px-4 py-2 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6] w-full'
                        value={artisanSheet.careCustom}
                        onChange={(e) => setSheet("careCustom", e.target.value)}
                        placeholder="Ex: éviter le parfum, ranger dans une pochette, ne pas exposer au soleil..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <h2 className="text-[#d0d2d6] font-semibold">Description</h2>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={generateDescription}
                        className="px-4 py-2 rounded-md bg-amber-500 text-white hover:shadow-lg hover:shadow-amber-400/30"
                      >
                        Générer description pro
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setState(prev => ({ ...prev, description: "" }));
                          setTouchedGenerate(false);
                        }}
                        className="px-4 py-2 rounded-md border border-slate-700 text-[#d0d2d6] hover:bg-slate-700/30"
                      >
                        Vider
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mb-1">
                    <p className="text-xs text-[#d0d2d6]/70">
                      {touchedGenerate ? "Tu peux modifier la description générée si tu veux." : 'Astuce : clique sur "Générer" pour une fiche homogène.'}
                    </p>
                    <span className="text-xs text-[#d0d2d6]/70">{descriptionLength} caractères</span>
                  </div>

                  <textarea
                    className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6] w-full'
                    onChange={inputHandle}
                    value={state.description}
                    name='description'
                    id='description'
                    placeholder="Décris l'article (matière, usage, particularités…) ou clique sur Générer."
                    rows={6}
                  />

                  {!canGoStep2() && (
                    <p className="text-xs text-red-200 mt-2">
                      Pour passer à l'étape 2 : il faut au minimum un nom, une catégorie et une description correcte.
                    </p>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={goNext}
                      className="px-5 py-2 rounded-md bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-400/30"
                    >
                      Continuer → Prix & images
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="p-4 rounded-md border border-slate-700 bg-[#6a5fdf] sticky top-4">
                  <h2 className="text-[#d0d2d6] font-semibold mb-2">Aperçu</h2>

                  <div className="p-3 rounded-md border border-slate-700 bg-slate-900/20">
                    <p className="text-white font-semibold text-sm">
                      {state.name.trim() ? state.name : "Nom de l'article"}
                    </p>
                    <p className="text-[#d0d2d6]/70 text-xs mt-1">
                      {category ? category : "Catégorie"} • {isUniqueItem ? "Pièce unique" : "Stock variable"}
                    </p>

                    <div className="mt-3">
                      <p className="text-[#d0d2d6] text-xs font-semibold mb-1">Fiche rapide</p>
                      <ul className="text-[#d0d2d6]/80 text-xs space-y-1">
                        <li>Matériaux : {artisanSheet.materials.length ? artisanSheet.materials.join(", ") : "—"}</li>
                        <li>Technique : {artisanSheet.technique || "—"}</li>
                        <li>Taille : {artisanSheet.size.trim() || "—"}</li>
                        <li>Usage : {artisanSheet.usage.length ? artisanSheet.usage.join(", ") : "—"}</li>
                        <li>Préparation : {artisanSheet.leadTime === "sur-commande" ? "Sur commande" : artisanSheet.leadTime}</li>
                      </ul>
                    </div>

                    <div className="mt-3">
                      <p className="text-[#d0d2d6] text-xs font-semibold mb-1">Description</p>
                      <div className="text-[#d0d2d6]/80 text-xs whitespace-pre-wrap max-h-[220px] overflow-y-auto border border-slate-700 rounded-md p-2">
                        {(state.description || "").trim() ? state.description : "La description apparaîtra ici."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-[#d0d2d6]/70">
                    Conseil : vise <span className="text-white font-semibold">80–90%</span> avant de publier.
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="mb-3 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
                  <h2 className="text-[#d0d2d6] font-semibold mb-3">Prix & stock</h2>

                  <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                    <div className='flex flex-col w-full gap-1'>
                      <label htmlFor="price">Prix</label>
                      <input
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        onChange={inputHandle}
                        value={state.price}
                        type="number"
                        name='price'
                        id='price'
                        placeholder='Prix'
                      />
                    </div>

                    <div className='flex flex-col w-full gap-1'>
                      <label htmlFor="discount">Réduction</label>
                      <input
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        onChange={inputHandle}
                        value={state.discount}
                        type="number"
                        name='discount'
                        id='discount'
                        placeholder='Réduction en %'
                      />
                    </div>

                    <div className='flex flex-col w-full gap-1'>
                      <label htmlFor="stock">Stock</label>
                      <input
                        className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]'
                        onChange={inputHandle}
                        value={state.stock}
                        type="text"
                        name='stock'
                        id='stock'
                        placeholder='Stock'
                        disabled={isUniqueItem}
                      />
                    </div>
                  </div>

                  <div className='flex items-center gap-2 text-[#d0d2d6]'>
                    <input
                      type="checkbox"
                      id="uniqueItem2"
                      checked={isUniqueItem}
                      onChange={(e) => setIsUniqueItem(e.target.checked)}
                      className='w-4 h-4 cursor-pointer accent-amber-500'
                    />
                    <label htmlFor="uniqueItem2" className='cursor-pointer select-none'>
                      Pièce unique (stock automatiquement fixé à 1)
                    </label>
                  </div>
                </div>

                <div className="mb-3 p-4 rounded-md border border-slate-700 bg-[#6a5fdf]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h2 className="text-[#d0d2d6] font-semibold">Images</h2>
                    <p className="text-xs text-[#d0d2d6]/70">
                      Idéal : 3 à 5 photos (face, profil, détail, porté/usage).
                    </p>
                  </div>

                  <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4'>
                    {imageShow.map((img, i) => (
                      <div key={i} className='h-[180px] relative'>
                        <label htmlFor={`img_${i}`}>
                          <img className='w-full h-full rounded-sm object-cover' src={img.url} alt="" />
                        </label>
                        <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={`img_${i}`} className='hidden' />
                        <span
                          onClick={() => removeImage(i)}
                          className='p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full'
                          title="Retirer l'image"
                        >
                          <IoMdCloseCircle />
                        </span>
                        {isUniqueItem && (
                          <span className='absolute top-10 left-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 text-xs font-bold rounded shadow-lg z-10'>
                            PIÈCE UNIQUE
                          </span>
                        )}
                      </div>
                    ))}

                    <label className='flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#d0d2d6] rounded-md' htmlFor="image">
                      <span className="text-xl"><IoMdImages /></span>
                      <span>Sélectionner images</span>
                    </label>
                    <input className='hidden' onChange={imageHandle} multiple type="file" id='image' />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-5 py-2 rounded-md border border-slate-700 text-[#d0d2d6] hover:bg-slate-700/30"
                    >
                      ← Retour fiche
                    </button>

                    <button
                      disabled={loader ? true : false}
                      className='bg-red-500 w-[280px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2'
                    >
                      {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Ajouter article'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="p-4 rounded-md border border-slate-700 bg-[#6a5fdf] sticky top-4">
                  <h2 className="text-[#d0d2d6] font-semibold mb-2">Résumé avant publication</h2>

                  <div className="text-[#d0d2d6]/80 text-sm space-y-2">
                    <p><span className="text-white font-semibold">Nom :</span> {state.name || "—"}</p>
                    <p><span className="text-white font-semibold">Catégorie :</span> {category || "—"}</p>
                    <p><span className="text-white font-semibold">Prix :</span> {state.price ? `${state.price}` : "—"}</p>
                    <p><span className="text-white font-semibold">Stock :</span> {isUniqueItem ? "1 (pièce unique)" : (state.stock || "—")}</p>
                    <p><span className="text-white font-semibold">Images :</span> {images.length}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-[#d0d2d6] text-xs font-semibold mb-1">Description (aperçu)</p>
                    <div className="text-[#d0d2d6]/80 text-xs whitespace-pre-wrap max-h-[240px] overflow-y-auto border border-slate-700 rounded-md p-2">
                      {(state.description || "").trim() ? state.description : "—"}
                    </div>
                  </div>

                  {quality.tips.length > 0 && (
                    <div className="mt-3 text-xs text-[#d0d2d6]/70">
                      Dernier conseil : {quality.tips[0]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

