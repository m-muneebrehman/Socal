"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Users, DollarSign, Tag, Home, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";

interface CityHighlight {
  title: string;
  description: string;
  icon: string;
  bgImage: string;
}

interface CityFAQ {
  question: string;
  answer: string;
  category: string;
}

interface CityClient {
  name: string;
  description: string;
  image: string;
  rating: number;
  review: string;
}

interface City {
  _id?: string;
  slug: string;
  name: string;
  state: string;
  shortDescription: string;
  heroImage: string;
  population: string;
  avgHomePrice: string;
  tags: string[];
  neighborhoods: string[];
  fullDescription: string;
  highlights: CityHighlight[];
  faqs: CityFAQ[];
  clients?: CityClient[];
  createdAt?: string;
  updatedAt?: string;
}

export function CityManager() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<City>({
    slug: "",
    name: "",
    state: "",
    shortDescription: "",
    heroImage: "",
    population: "",
    avgHomePrice: "",
    tags: [],
    neighborhoods: [],
    fullDescription: "",
    highlights: [],
    faqs: [],
    clients: []
  });

  // Fetch cities
  const fetchCities = async () => {
    try {
      const response = await fetch('/admin/api/cities');
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      toast.error("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      slug: "",
      name: "",
      state: "",
      shortDescription: "",
      heroImage: "",
      population: "",
      avgHomePrice: "",
      tags: [],
      neighborhoods: [],
      fullDescription: "",
      highlights: [],
      faqs: [],
      clients: []
    });
    setEditingCity(null);
  };

  // Open modal for create/edit
  const openModal = (city?: City) => {
    if (city) {
      setEditingCity(city);
      setFormData({
        slug: city.slug,
        name: city.name,
        state: city.state,
        shortDescription: city.shortDescription,
        heroImage: city.heroImage,
        population: city.population,
        avgHomePrice: city.avgHomePrice,
        tags: city.tags || [],
        neighborhoods: city.neighborhoods || [],
        fullDescription: city.fullDescription,
        highlights: city.highlights || [],
        faqs: city.faqs || [],
        clients: city.clients || []
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/admin/api/cities';
      const method = editingCity ? 'PUT' : 'POST';
      const body = editingCity ? { 
        slug: formData.slug,
        name: formData.name,
        state: formData.state,
        shortDescription: formData.shortDescription,
        heroImage: formData.heroImage,
        population: formData.population,
        avgHomePrice: formData.avgHomePrice,
        tags: formData.tags,
        neighborhoods: formData.neighborhoods,
        fullDescription: formData.fullDescription,
        highlights: formData.highlights,
        faqs: formData.faqs,
        clients: formData.clients,
        _id: editingCity._id 
      } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save city');
      }

      toast.success(`City ${editingCity ? 'updated' : 'created'} successfully`);

      setIsModalOpen(false);
      resetForm();
      fetchCities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save city");
    }
  };

  // Delete city
  const deleteCity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;

    try {
      const response = await fetch('/admin/api/cities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });

      if (!response.ok) throw new Error('Failed to delete city');

      toast.success("City deleted successfully");
      fetchCities();
    } catch (error) {
      toast.error("Failed to delete city");
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof City] as string[], value.trim()]
      }));
    }
  };

  // Remove item from array
  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof City] as string[]).filter((_, i) => i !== index)
    }));
  };

  // Add highlight
  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, {
        title: "",
        description: "",
        icon: "",
        bgImage: ""
      }]
    }));
  };

  // Update highlight
  const updateHighlight = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => 
        i === index ? { ...highlight, [field]: value } : highlight
      )
    }));
  };

  // Remove highlight
  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Add FAQ
  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, {
        question: "",
        answer: "",
        category: ""
      }]
    }));
  };

  // Update FAQ
  const updateFAQ = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  // Remove FAQ
  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading cities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">City Manager</h2>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add City
        </Button>
      </div>

      {/* City List */}
      <div className="grid gap-4">
        {cities.map((city) => (
          <div key={city._id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xl font-semibold">{city.name}, {city.state}</h3>
                </div>
                <p className="text-gray-600 mb-3">{city.shortDescription}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {city.population}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {city.avgHomePrice}
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {city.neighborhoods.length} neighborhoods
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {city.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {city.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{city.tags.length - 3} more
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Slug: {city.slug}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="w-4 h-4" />
                  {city.highlights.length} highlights
                  <MessageSquare className="w-4 h-4" />
                  {city.faqs.length} FAQs
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  className="p-2 border rounded hover:bg-gray-50"
                  onClick={() => openModal(city)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 border rounded hover:bg-red-50 text-red-600"
                  onClick={() => deleteCity(city._id!)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No cities found. Create your first city profile!
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingCity ? 'Edit City' : 'Create New City'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    placeholder="los-angeles"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Los Angeles"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="California"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Population *</label>
                  <input
                    type="text"
                    value={formData.population}
                    onChange={(e) => handleFieldChange('population', e.target.value)}
                    placeholder="4M+"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Average Home Price *</label>
                  <input
                    type="text"
                    value={formData.avgHomePrice}
                    onChange={(e) => handleFieldChange('avgHomePrice', e.target.value)}
                    placeholder="$800K"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Image URL *</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => handleFieldChange('heroImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description *</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                  placeholder="A vibrant city known for entertainment and culture"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Description *</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleFieldChange('fullDescription', e.target.value)}
                  placeholder="Detailed description of the city..."
                  rows={4}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1">Tags *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag"
                      className="flex-1 p-2 border rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleArrayFieldChange('tags', input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('tags', index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Neighborhoods */}
              <div>
                <label className="block text-sm font-medium mb-1">Neighborhoods *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a neighborhood"
                      className="flex-1 p-2 border rounded"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleArrayFieldChange('neighborhoods', input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.neighborhoods.map((neighborhood, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded flex items-center gap-1">
                        {neighborhood}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('neighborhoods', index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Highlights *</label>
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Add Highlight
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Highlight {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <input
                            type="text"
                            value={highlight.title}
                            onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Icon</label>
                          <input
                            type="text"
                            value={highlight.icon}
                            onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                            placeholder="🏖️"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={highlight.description}
                          onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                          placeholder="Enter description"
                          rows={2}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-1">Background Image URL</label>
                        <input
                          type="text"
                          value={highlight.bgImage}
                          onChange={(e) => updateHighlight(index, 'bgImage', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">FAQs *</label>
                  <button
                    type="button"
                    onClick={addFAQ}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Add FAQ
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.faqs.map((faq, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">FAQ {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Question</label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            placeholder="Enter question"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                            placeholder="Enter answer"
                            rows={3}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <input
                            type="text"
                            value={faq.category}
                            onChange={(e) => updateFAQ(index, 'category', e.target.value)}
                            placeholder="e.g., Real Estate, Lifestyle"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingCity ? 'Update City' : 'Create City'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 