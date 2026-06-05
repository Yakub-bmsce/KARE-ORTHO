import os
from PIL import Image

def crop_doctor():
    input_path = r"public\dr-ajay-treat.jpg"
    output_path = r"public\doctor-profile.jpg"
    
    if not os.path.exists(input_path):
        print(f"Error: Could not find {input_path}")
        return
        
    print(f"Loading image {input_path}...")
    img = Image.open(input_path)
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    # Dr. Ajay N is standing on the right-hand side of this 1020x1020 image.
    # Let's crop from x = 380 to 980 (600px width) and y = 80 to 1020 (940px height).
    left = 380
    top = 80
    right = 980
    bottom = 1020
    
    print(f"Cropping box: left={left}, top={top}, right={right}, bottom={bottom}")
    cropped_img = img.crop((left, top, right, bottom))
    
    print(f"Saving cropped portrait to {output_path}...")
    cropped_img.save(output_path, "JPEG")
    print("Doctor profile cropped successfully!")

if __name__ == "__main__":
    crop_doctor()
