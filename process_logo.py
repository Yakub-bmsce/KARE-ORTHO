import os
import sys
from PIL import Image

def process_logo(input_path, output_path):
    print(f"Loading image from: {input_path}")
    if not os.path.exists(input_path):
        print(f"Error: Input file does not exist at {input_path}")
        sys.exit(1)
        
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        # If the pixel is close to white (background), make it transparent
        if r > 240 and g > 240 and b > 240:
            new_data.append((0, 0, 0, 0))
        else:
            # Let's adjust colors for dark navy background.
            # We want:
            # - KARE (dark teal) to become bright teal (#00c9a7)
            # - Orthopaedics (dark grey/black) to become white (#ffffff)
            # - "Bringing Mobility to Life" (black) to become white (#ffffff) or muted silver (#a0aec0)
            # - Knee joint illustration: It has bone color (yellowish/beige) and orange joint lines.
            #   Let's preserve the orange/bone colors while enhancing dark colors to white/teal.
            
            # Simple heuristic based on RGB values:
            # Black/very dark text: r < 100, g < 100, b < 100 (excluding teal which has g > b)
            # Let's check:
            is_teal = (g > r + 10) and (g > b + 10)
            
            if is_teal:
                # Dark teal -> bright teal (#00c9a7 -> rgb(0, 201, 167))
                # Let's boost the brightness of the teal
                # Maintain the alpha channel
                new_data.append((0, 201, 167, a))
            elif r < 100 and g < 100 and b < 100:
                # Black/dark grey -> white (255, 255, 255)
                new_data.append((255, 255, 255, a))
            elif r > 100 and g > 100 and b < 80:
                # Yellowish bone color -> keep but brighten
                new_data.append((min(r + 30, 255), min(g + 30, 255), b, a))
            elif r > 150 and g < 100 and b < 50:
                # Orange joint accent -> keep orange/red but vivid
                new_data.append((r, g, b, a))
            else:
                # Any other dark text/logo outline: make white
                # Calculate average brightness:
                brightness = (r + g + b) / 3
                if brightness < 150:
                    # Dark lines -> white
                    new_data.append((255, 255, 255, a))
                else:
                    new_data.append((r, g, b, a))

    img.putdata(new_data)
    
    # Save the file
    print(f"Saving processed image to: {output_path}")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print("Logo processed successfully!")

if __name__ == "__main__":
    input_img = r"C:\Users\Asus expertbook\.gemini\antigravity\brain\58a6f8c0-8b65-4220-b6d0-aeafb5c305e1\media__1780657550417.png"
    output_dir = r"C:\Users\Asus expertbook\.gemini\antigravity\scratch\kare-orthopaedics\public"
    output_img = os.path.join(output_dir, "logo.png")
    process_logo(input_img, output_img)
