import React, { useState, useEffect } from 'react';
import { X, Cloud, HardDrive, Download, Upload, Check, Loader2, LogOut, FileJson, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken, listDriveFiles, saveBackupToDrive, getDriveFileContent, DriveFileItem } from '../utils/googleDriveService';
import { useCart } from '../context/CartContext';
import SAVED_PRODUCTS from '../data/products.json';
import SAVED_TIKTOK_REELS from '../data/tiktok_reels.json';
import SAVED_INSTAGRAM_ITEMS from '../data/instagram_journal.json';
import SAVED_CRAFT_STORY from '../data/craft_story.json';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  const { products, reels, instagramItems, craftStory, setProducts } = useCart() as any;
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        loadDriveFiles(t);
      },
      () => {
        setUser(null);
        setToken(null);
        setDriveFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setActionMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await loadDriveFiles(res.accessToken);
      }
    } catch (err: any) {
      setActionMessage(`Sign in failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setDriveFiles([]);
  };

  const loadDriveFiles = async (accessToken: string) => {
    setFetchingFiles(true);
    try {
      const files = await listDriveFiles(accessToken, "mimeType = 'application/json'");
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
    } finally {
      setFetchingFiles(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!token) return;
    setLoading(true);
    setActionMessage(null);
    try {
      const currentProducts = products && products.length > 0 ? products : SAVED_PRODUCTS;
      const currentReels = reels && reels.length > 0 ? reels : SAVED_TIKTOK_REELS;
      const currentInstagram = instagramItems && instagramItems.length > 0 ? instagramItems : SAVED_INSTAGRAM_ITEMS;
      const currentCraftStory = craftStory || SAVED_CRAFT_STORY;

      const backupBundle = {
        appName: "Artified NP - Handmade Craft Atelier",
        backupDate: new Date().toISOString(),
        products: currentProducts,
        reels: currentReels,
        instagramItems: currentInstagram,
        craftStory: currentCraftStory,
      };

      const fileName = `ArtifiedNP_Drive_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      await saveBackupToDrive(token, fileName, backupBundle);
      setActionMessage('Successfully backed up complete website to Google Drive!');
      await loadDriveFiles(token);
    } catch (err: any) {
      setActionMessage(`Backup failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFromDrive = async (fileId: string, fileName: string) => {
    if (!token) return;
    setLoading(true);
    setActionMessage(null);
    try {
      const data = await getDriveFileContent(token, fileId);
      if (data && data.products) {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          try {
            localStorage.setItem('artified_products_custom', JSON.stringify(data.products));
          } catch {}
        }
        setActionMessage(`Successfully restored data from "${fileName}"!`);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        setActionMessage('Selected file does not contain valid Artified NP backup structure.');
      }
    } catch (err: any) {
      setActionMessage(`Restore failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] text-[#1C1B1A] border border-[#E8DFD8] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#736C65] hover:text-[#1C1B1A] p-1.5 rounded-full hover:bg-[#E8DFD8]/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold text-[#1C1B1A]">
              Google Drive Cloud Sync
            </h3>
            <p className="text-xs text-[#736C65]">
              Securely backup and restore your artisan catalog with Google Drive
            </p>
          </div>
        </div>

        {!user ? (
          <div className="space-y-6 py-6 text-center">
            <div className="max-w-xs mx-auto space-y-3">
              <p className="text-xs text-[#736C65]">
                Sign in with your Google account to connect Google Drive storage and manage cloud backups.
              </p>
              
              {/* Official Google Sign In Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="gsi-material-button w-full py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer disabled:opacity-50 mx-auto"
              >
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: '18px', height: '18px', display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents">Sign in with Google</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8DFD8]">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center font-bold justify-center">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-[#1C1B1A]">{user.displayName || user.email}</div>
                  <div className="text-[11px] text-[#736C65]">{user.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Backup Action */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleBackupToDrive}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Backup Website to Google Drive Now</span>
              </button>
            </div>

            {/* Action Message */}
            {actionMessage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-blue-600" />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* Drive Backups List */}
            <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#E8DFD8]">
              <h4 className="text-xs font-bold text-[#1C1B1A] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Existing Cloud Backups</span>
                {fetchingFiles && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#736C65]" />}
              </h4>
              
              {driveFiles.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#736C65]">
                  {fetchingFiles ? 'Loading Drive files...' : 'No JSON backup files found in your Google Drive.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {driveFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E8DFD8] rounded-xl text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <FileJson className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate font-medium text-[#1C1B1A]">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRestoreFromDrive(file.id, file.name)}
                        disabled={loading}
                        className="py-1 px-2.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#736C65] hover:text-[#1C1B1A] font-medium underline cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
