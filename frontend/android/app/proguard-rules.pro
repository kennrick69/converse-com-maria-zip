# ============================================
# PROGUARD RULES - CONVERSE COM MARIA
# ============================================

# Capacitor
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-dontwarn com.getcapacitor.**

# Capacitor Plugins
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class * extends com.getcapacitor.Plugin { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# AdMob
-keep class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# Cordova
-keep class org.apache.cordova.** { *; }
-dontwarn org.apache.cordova.**

# WebView / JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Remove logs in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Gson (se usar)
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# OkHttp (se usar)
-dontwarn okhttp3.**
-dontwarn okio.**

# General
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
