//////////////////////////////////////////////////////////////////////////////////////////
//          )                                                   (                       //
//       ( /(   (  (               )    (       (  (  (         )\ )    (  (            //
//       )\()) ))\ )(   (         (     )\ )    )\))( )\  (    (()/( (  )\))(  (        //
//      ((_)\ /((_|()\  )\ )      )\  '(()/(   ((_)()((_) )\ )  ((_)))\((_)()\ )\       //
//      | |(_|_))( ((_)_(_/(    _((_))  )(_))  _(()((_|_)_(_/(  _| |((_)(()((_|(_)      //
//      | '_ \ || | '_| ' \))  | '  \()| || |  \ V  V / | ' \)) _` / _ \ V  V (_-<      //
//      |_.__/\_,_|_| |_||_|   |_|_|_|  \_, |   \_/\_/|_|_||_|\__,_\___/\_/\_//__/      //
//                                 |__/                                                 //
//                       Copyright (c) 2021 Simon Schneegans                            //
//          Released under the GPLv3 or later. See LICENSE file for details.            //
//////////////////////////////////////////////////////////////////////////////////////////

// The content from common.glsl is automatically prepended to each shader effect.

uniform float uActorScale;
uniform float uHorizontalScale;
uniform float uVerticalScale;
uniform float uPixelSize;

void main() {
  // We simply inverse the progress for opening windows.
  float pixelateProgress = uForOpening ? 0.9 - uProgress : uProgress;

  float pixelSize = max(1.0, ceil(uPixelSize * pixelateProgress + 1.0));
  vec2 pixelGrid  = vec2(pixelSize) / uSize;

  vec2 texcoord = iTexCoord.st;
  texcoord.y    = texcoord.y * uActorScale + 0.5 - uActorScale * 0.5;
  texcoord -= mod(iTexCoord.st, pixelGrid);
  texcoord += pixelGrid * 0.5;

  float hScale = uHorizontalScale * uSize.x * 0.001;
  float vScale = uVerticalScale * uSize.y * 0.00002 * uActorScale;

  float noise = simplex2DFractal(texcoord.xx * hScale) * 2.0 - 0.5;

  float shiftProgress = uForOpening ? mix(-vScale - 1.0, 0.0, uProgress)
                                    : mix(-vScale, 1.0 + vScale, uProgress);
  float shift         = noise * vScale + shiftProgress;

  if (uForOpening) {
    texcoord.y -= 0.5 * uActorScale * min(shift, 0.0);
  } else {
    texcoord.y -= 0.5 * uActorScale * max(shift, 0.0);
  }

  vec4 oColor = getInputColor(texcoord);

  setOutputColor(oColor);
}