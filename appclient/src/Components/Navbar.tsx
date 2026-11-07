import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn, userName, logout } = useUser();

  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    router.push(path as any);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {/* Brand Logo */}
          <TouchableOpacity onPress={() => handleNavigation('/')} activeOpacity={0.7}>
            <Text style={styles.logoText}>GameShop</Text>
          </TouchableOpacity>

          {/* Desktop Navigation Links */}
          {!isMobile ? (
            <View style={styles.centerNavLinks}>
              <TouchableOpacity
                style={[styles.navLink, pathname === '/' && styles.activeNavLink]}
                onPress={() => handleNavigation('/')}
              >
                <Text style={[styles.navLinkText, pathname === '/' && styles.activeNavLinkText]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navLink, pathname === '/games' && styles.activeNavLink]}
                onPress={() => handleNavigation('/games')}
              >
                <Text style={[styles.navLinkText, pathname === '/games' && styles.activeNavLinkText]}>
                  Games
                </Text>
              </TouchableOpacity>

              {isLoggedIn ? (
                <>
                  <View style={styles.userBadge}>
                    <Ionicons name="person-circle-outline" size={20} color="#E9D5FF" />
                    <Text style={styles.userNameText}>{userName || 'User'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="log-out-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.logoutButtonText}>Log out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.navLink, pathname === '/login' && styles.activeNavLink]}
                    onPress={() => handleNavigation('/login')}
                  >
                    <Text style={[styles.navLinkText, pathname === '/login' && styles.activeNavLinkText]}>
                      Login
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.registerButton, pathname === '/signup' && styles.activeRegisterButton]}
                    onPress={() => handleNavigation('/signup')}
                  >
                    <Text style={styles.registerButtonText}>
                      Signup
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            /* Mobile Hamburger Toggle */
            <View style={styles.mobileControlGroup}>
              <TouchableOpacity
                style={styles.hamburgerButton}
                onPress={() => setMenuOpen(!menuOpen)}
              >
                <Ionicons
                  name={menuOpen ? 'close-outline' : 'menu-outline'}
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Mobile Dropdown Menu Container */}
        {isMobile && menuOpen && (
          <View style={styles.mobileDropdown}>
            <View style={styles.mobileNavLinks}>
              <TouchableOpacity
                style={[styles.mobileNavLink, pathname === '/' && styles.activeMobileNavLink]}
                onPress={() => handleNavigation('/')}
              >
                <Text style={[styles.mobileNavLinkText, pathname === '/' && styles.activeNavLinkText]}>
                  Home
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mobileNavLink, pathname === '/games' && styles.activeMobileNavLink]}
                onPress={() => handleNavigation('/games')}
              >
                <Text style={[styles.mobileNavLinkText, pathname === '/games' && styles.activeNavLinkText]}>
                  Games
                </Text>
              </TouchableOpacity>

              {isLoggedIn ? (
                <>
                  <View style={styles.mobileUserBadge}>
                    <Ionicons name="person-circle-outline" size={22} color="#E9D5FF" />
                    <Text style={styles.userNameText}>{userName || 'User'}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.mobileLogoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="log-out-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutButtonText}>Log out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.mobileNavLink, pathname === '/login' && styles.activeMobileNavLink]}
                    onPress={() => handleNavigation('/login')}
                  >
                    <Text style={[styles.mobileNavLinkText, pathname === '/login' && styles.activeNavLinkText]}>
                      Login
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.mobileRegisterButton, pathname === '/signup' && styles.activeMobileRegisterButton]}
                    onPress={() => handleNavigation('/signup')}
                  >
                    <Text style={styles.registerButtonText}>
                      Signup
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#3b0764',
    paddingTop: StatusBar.currentHeight || 0,
    width: '100%',
  },
  container: {
    width: '100%',
    backgroundColor: '#3b0764',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerNavLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLink: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeNavLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  navLinkText: {
    color: '#E9D5FF',
    fontSize: 15,
    fontWeight: '500',
  },
  activeNavLinkText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  registerButton: {
    backgroundColor: '#7e22ce',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  activeRegisterButton: {
    backgroundColor: '#9333ea',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  userNameText: {
    color: '#F3E8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mobileControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    padding: 4,
  },
  mobileDropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#581c87',
    width: '100%',
  },
  mobileNavLinks: {
    flexDirection: 'column',
    gap: 8,
  },
  mobileNavLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeMobileNavLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mobileNavLinkText: {
    color: '#E9D5FF',
    fontSize: 16,
    fontWeight: '500',
  },
  mobileRegisterButton: {
    alignItems: 'center',
    backgroundColor: '#7e22ce',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  activeMobileRegisterButton: {
    backgroundColor: '#9333ea',
  },
  mobileUserBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginTop: 4,
  },
  mobileLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
});
