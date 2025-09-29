# แอปจัดการหนังสือ

แอปจัดการหนังสือเป็นแอปพลิเคชันที่พัฒนาด้วย **React Native** (ใช้ Expo) และมีแบ็กเอนด์ที่พัฒนาด้วย **Node.js** และ **MongoDB** ช่วยให้ผู้ใช้สามารถจัดการหนังสือของตนเองได้ โดยรองรับการสร้าง แก้ไข ลบ และดูรายการหนังสือ รวมถึงการลงชื่อเข้าใช้และลงทะเบียน 

**หมายเหตุ**: ไฟล์ `.env` สำหรับ (lab) เท่านั้น

---

## คุณสมบัติ
- **ดูรายการหนังสือ**: แสดงรายการหนังสือทั้งหมดของผู้ใช้
- **เพิ่มหนังสือใหม่**: สร้างหนังสือใหม่
- **แก้ไข/ลบหนังสือ**: แก้ไขหรือลบหนังสือ
- **การลงชื่อเข้าใช้/ลงทะเบียน**: รองรับการยืนยันตัวตนผู้ใช้ผ่าน
- **รองรับการตั้งค่า** Biometrics เพื่อใช้ล็อกอินอัตโนมัติ
- Biometrics

หลังจากล็อกอินสำเร็จ ผู้ใช้สามารถเลือก "ตั้งค่า Biometrics" 

แอปจะสร้าง biometricKey (หรือ token ย่อยเชื่อมโยงกับ refreshToken) และเก็บไว้ใน SecureStore

เมื่อเปิดแอปครั้งถัดไป หากผู้ใช้เลือกล็อกอินด้วย Biometrics แอปจะเรียก LocalAuthentication.authenticateAsync()

หากสำเร็จ แอปจะใช้ refreshToken (จาก SecureStore) เพื่อขอ accessToken ใหม่จากเซิร์ฟเวอร์ แล้วล็อกอินให้อัตโนมัติ

การล็อกเอาต์และการรีเซ็ต Biometrics

เมื่อล็อกเอาต์: แอปลบ accessToken และ userId จาก AsyncStorage แต่ ไม่ลบ refreshToken และ biometricKey หากผู้ใช้ต้องการให้ Biometrics ยกเลิก ให้เพิ่มฟังก์ชันรีเซ็ตที่จะลบ refreshToken และ biometricKey จาก SecureStore

---

## การติดตั้ง

### 1. ตั้งค่าแบ็กเอนด์
1. โฟลเดอร์ `server`
    ```bash
    cd server
    ```
2. ติดตั้ง dependencies
    ```bash
    npm install
    ```
3. ตั้งค่าไฟล์ `.env` สำหรับเชื่อมต่อ MongoDB 
    ```
    PORT=3000
    MONGO_URI=<MongoDB>
    JWT_SECRET=<รหัสลับ>
    ```
4. รันเซิร์ฟเวอร์
    ```bash
    npm start
    ```
    เซิร์ฟเวอร์จะรันที่ `http://localhost:3000`

---

### 2. ตั้งค่าแอป React Native (Frontend)
1. นำทางไปยังโฟลเดอร์แอป
    ```bash
    cd ../app
    ```
2. ติดตั้ง dependencies
    ```bash
    npm install
    npx expo install expo-secure-store expo-local-authentication
    ```
3. รันแอปด้วย Expo
    ```bash
    npx expo start
    ```


---

