-- Inserta el índice de contenidos como campo real de Word (TOC \o "1-3")
-- en la posición marcada por `::: {#indice}` dentro de informe.md.
--
-- Por qué NO se usa --toc de Pandoc: con ese flag, Pandoc coloca el índice
-- al inicio del cuerpo del documento, ANTES de la carátula (posición
-- incorrecta para el formato de tesis). Este filtro genera el mismo campo
-- de Word, pero en el lugar exacto donde el Markdown lo declara
-- (tras Agradecimiento, antes de Resumen — estructura-tesis-maestra.md).
--
-- El campo se puebla con entradas reales (texto + puntitos + número de
-- página) si existe output/trabajo/indice-paginas.json — lo escribe
-- extraer_paginas_indice.js a partir del PDF ya maquetado, para que el
-- índice no dependa de que alguien presione F9. Sin el JSON, deja el
-- placeholder (ninguna exportación falla en silencio).
--
-- Uso: pandoc ... --lua-filter=indice-toc.lua (además de --from markdown+raw_attribute)

local RUTA_PAGINAS = 'output/trabajo/indice-paginas.json'

local function escape_xml(s)
  return tostring(s):gsub('&', '&amp;'):gsub('<', '&lt;'):gsub('>', '&gt;')
end

local function leer_paginas()
  local f = io.open(RUTA_PAGINAS, 'r')
  if not f then return nil end
  local contenido = f:read('*a')
  f:close()
  local ok, datos = pcall(pandoc.json.decode, contenido)
  if not ok or type(datos) ~= 'table' then return nil end
  return datos
end

-- Ancho útil Carta (12240 twips) menos márgenes (1440+1440) = 9360.
local TAB_DERECHA = 9350

local function entrada_openxml(e)
  local indent = (e.nivel == 3) and 360 or 0
  return '<w:p><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="' .. TAB_DERECHA .. '"/></w:tabs>'
    .. '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:left="' .. indent .. '"/></w:pPr>'
    .. '<w:r><w:t>' .. escape_xml(e.titulo) .. '</w:t></w:r>'
    .. '<w:r><w:tab/><w:t>' .. string.format('%d', tonumber(e.pagina) or 0) .. '</w:t></w:r></w:p>'
end

local function indice_poblado_openxml(datos)
  local partes = {
    '<w:p><w:pPr><w:pStyle w:val="TOCHeading"/></w:pPr><w:r><w:t>ÍNDICE DE CONTENIDOS</w:t></w:r></w:p>',
    '<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r></w:p>',
  }
  for i, e in ipairs(datos) do
    local esUltima = (i == #datos)
    -- El salto de página va DENTRO del último párrafo (tras el fin del campo):
    -- un párrafo suelto solo con el salto genera una página en blanco en la
    -- maquetación de LibreOffice cuando el campo TOC ocupa una página entera.
    local fin = esUltima
      and '<w:r><w:fldChar w:fldCharType="end"/></w:r><w:r><w:br w:type="page"/></w:r>'
      or ''
    partes[#partes + 1] = entrada_openxml(e) .. fin
  end
  return pandoc.RawBlock('openxml', table.concat(partes, ''))
end

local function indice_placeholder_openxml()
  return pandoc.RawBlock('openxml', [[<w:p><w:pPr><w:pStyle w:val="TOCHeading"/></w:pPr><w:r><w:t>ÍNDICE DE CONTENIDOS</w:t></w:r></w:p><w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>Ejecutar el pipeline del índice: pandoc → PDF (LibreOffice) → extraer_paginas_indice.js → pandoc de nuevo (ver exportar-word.md).</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p><w:p><w:r><w:br w:type="page"/></w:r></w:p>]])
end

function Div(el)
  if el.identifier == 'indice' then
    local datos = leer_paginas()
    if datos and #datos > 0 then
      return { indice_poblado_openxml(datos) }
    end
    return { indice_placeholder_openxml() }
  end
  return nil
end
