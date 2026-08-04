import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search as SearchIcon,
  X,
  Filter,
  Clock,
  TrendingUp,
  Loader as LoaderIcon,
  AlertCircle,
  ChevronDown,
  Grid3x3,
  List,
  Sparkles,
  Calendar,
  CheckSquare,
  Users,
  Briefcase,
  FileText,
  Command,
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { storage } from '../../utils/storage';
import { formatters } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';

// Storage key for recent searches
const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Search filters configuration
const SEARCH_FILTERS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'cards', label: 'Cards', icon: CheckSquare },
  { id: 'boards', label: 'Boards', icon: Grid3x3 },
  { id: 'workspaces', label: 'Workspaces', icon: Briefcase },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'documents', label: 'Documents', icon: FileText },
];

// Trending searches (mock data - could be fetched from backend)
const TRENDING_SEARCHES = [
  'Sprint Planning',
  'Bug Fixes',
  'Design Review',
  'User Stories',
  'Testing Tasks',
];

const Search = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [results, setResults] = useState({ cards: [], boards: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchTime, setSearchTime] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    const recent = storage.getItem(RECENT_SEARCHES_KEY) || [];
    setRecentSearches(recent);
  }, []);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape to clear search
      if (e.key === 'Escape') {
        handleClearSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setResults({ cards: [], boards: [] });
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await searchService.globalSearch(query, {
        filter: activeFilter !== 'all' ? activeFilter : undefined,
      });
      
      setResults(response.results || { cards: [], boards: [] });
      setSearchTime(Date.now() - startTime);
      setHasSearched(true);

      // Save to recent searches
      saveRecentSearch(query);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform search');
      setResults({ cards: [], boards: [] });
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);

    // Debounce search
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value);
      }
    }, 500);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setResults({ cards: [], boards: [] });
    setHasSearched(false);
    setShowSuggestions(false);
    setError(null);
    searchInputRef.current?.focus();
  };

  // Save recent search
  const saveRecentSearch = (query) => {
    const recent = storage.getItem(RECENT_SEARCHES_KEY) || [];
    const updated = [query, ...recent.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    storage.setItem(RECENT_SEARCHES_KEY, updated);
    setRecentSearches(updated);
  };

  // Remove recent search
  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter(s => s !== query);
    storage.setItem(RECENT_SEARCHES_KEY, updated);
    setRecentSearches(updated);
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    storage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  // Handle recent/trending search click
  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
    setShowSuggestions(false);
  };

  // Calculate total results
  const totalResults = (results.cards?.length || 0) + (results.boards?.length || 0);

  // Filter results by active filter
  const getFilteredResults = () => {
    if (activeFilter === 'all') {
      return [...(results.cards || []), ...(results.boards || [])];
    }
    if (activeFilter === 'cards') {
      return results.cards || [];
    }
    if (activeFilter === 'boards') {
      return results.boards || [];
    }
    return [];
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="min-h-full pb-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Search</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
            <Command size={14} />
            <span>K</span>
          </div>
        </div>
        <p className="text-gray-600">
          Search across cards, boards, workspaces, and more
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for cards, boards, workspaces..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all"
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && !hasSearched && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in">
              {recentSearches.length > 0 && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase">Recent</h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="flex-1 text-sm text-gray-700">{search}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Trending</h3>
                {TRENDING_SEARCHES.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <TrendingUp size={16} className="text-primary-500" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Search Filters */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {SEARCH_FILTERS.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <Icon size={16} />
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>

      {/* Search Statistics */}
      {hasSearched && !loading && (
        <div className="mb-6 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{totalResults}</span>
            <span>results</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{searchTime}ms</span>
            <span>search time</span>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <span className="font-semibold text-gray-900 capitalize">{activeFilter}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-20">
          <Loader />
          <p className="text-center text-gray-500 mt-4">Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => performSearch(searchQuery)}>Try Again</Button>
        </div>
      )}

      {/* Empty State - No search yet */}
      {!hasSearched && !loading && !error && (
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <SearchIcon className="text-primary-600" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Searching</h3>
          <p className="text-gray-600 mb-8">
            Search for cards, boards, workspaces, and more. Try using filters to narrow down results.
          </p>

          {recentSearches.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recent Searches</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(search)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Try Searching For</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {TRENDING_SEARCHES.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-sm text-primary-700 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State - No results */}
      {hasSearched && !loading && !error && totalResults === 0 && (
        <div className="max-w-md mx-auto py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <SearchIcon className="text-gray-400" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Found</h3>
          <p className="text-gray-600 mb-8">
            We couldn't find anything matching "{searchQuery}". Try a different search term or adjust your filters.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleClearSearch}>
              Clear Search
            </Button>
            <Button onClick={() => setActiveFilter('all')}>Reset Filters</Button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !loading && !error && totalResults > 0 && (
        <div>
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredResults.map((result, index) => (
                <SearchResultCard key={result._id || index} result={result} searchQuery={searchQuery} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((result, index) => (
                <SearchResultCard key={result._id || index} result={result} searchQuery={searchQuery} compact />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Search Result Card Component
const SearchResultCard = ({ result, searchQuery, compact = false }) => {
  const isCard = result.board;
  const isBoard = result.workspace;

  const getIcon = () => {
    if (isCard) return CheckSquare;
    if (isBoard) return Grid3x3;
    return FileText;
  };

  const getCategory = () => {
    if (isCard) return 'Card';
    if (isBoard) return 'Board';
    return 'Item';
  };

  const getBadgeColor = () => {
    if (isCard) return 'bg-blue-100 text-blue-700';
    if (isBoard) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getLink = () => {
    if (isCard) return `/board/${result.board._id}`;
    if (isBoard) return `/board/${result._id}`;
    return '#';
  };

  const highlightMatch = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-gray-900 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const Icon = getIcon();

  if (compact) {
    return (
      <a
        href={getLink()}
        className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all group"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <Icon size={20} className="text-gray-600 group-hover:text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-primary-600">
              {highlightMatch(result.title)}
            </h3>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor()}`}>
              {getCategory()}
            </span>
          </div>
        </div>
        {result.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {highlightMatch(formatters.truncate(result.description, 100))}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {result.updatedAt && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatters.formatRelativeTime(result.updatedAt)}</span>
            </div>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={getLink()}
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
          <Icon size={24} className="text-gray-600 group-hover:text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {highlightMatch(result.title)}
            </h3>
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${getBadgeColor()}`}>
              {getCategory()}
            </span>
          </div>
          {result.description && (
            <p className="text-gray-600 mb-3 line-clamp-2">
              {highlightMatch(result.description)}
            </p>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {result.updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Updated {formatters.formatRelativeTime(result.updatedAt)}</span>
              </div>
            )}
            {isCard && result.board && (
              <div className="flex items-center gap-2">
                <Grid3x3 size={14} />
                <span>{result.board.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default Search;
